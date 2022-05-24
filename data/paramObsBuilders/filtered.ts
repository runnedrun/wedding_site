import { objKeys } from "@/helpers/objKeys"
import {
  OrderByDirection,
  WhereFilterOp,
  orderBy,
  where,
  limit,
} from "firebase/firestore"
import { filter, map, of, switchMap, tap } from "rxjs"
import { buildObsForCollection } from "../builders/buildObsForCollection"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { CollectionModels } from "../firebaseObsBuilders/CollectionModels"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { Model } from "../baseTypes/Model"
import { attachObs } from "./attachObs"
import { UnionOfArgs } from "./ParamObsTypeUtils"
import { ValuesMapFromParamObsMap } from "./ParamObsTypeUtils"
import { getEmptyValuesMapFromParamObsMap } from "./getEmptyValuesMapFromParamObsMap"
import { combine } from "./combine"
import { staticValue } from "./staticValue"

type QueryValueOrTuple<FieldType> =
  | ParamaterizedObservable<any, FieldType, any>
  | [WhereFilterOp, ParamaterizedObservable<any, unknown, any>]

export type ModelFilter<M extends Model<any, any>> = Partial<
  {
    [key in keyof M]: QueryValueOrTuple<M[key]>
  }
>

type FilterTypeToParamObsMap<FilterType extends ModelFilter<any>> = {
  [key in keyof FilterType]: FilterType[key] extends ParamaterizedObservable<
    any,
    any,
    any
  >
    ? FilterType[key]
    : FilterType[key] extends [infer OperatorType, infer ParamObsType]
    ? ParamObsType extends ParamaterizedObservable<
        infer ArgsType,
        infer ValueType,
        infer NameType
      >
      ? ParamaterizedObservable<
          ArgsType,
          { _op: OperatorType; _value: ValueType },
          NameType
        >
      : never
    : never
}

type OrdersAndLimitsToParamObsMap<
  OrdersAndLimitsType extends OrdersAndLimits<any>
> = {
  [key in keyof OrdersAndLimitsType["orderBy"]]: OrdersAndLimitsType["orderBy"][key]
} &
  (OrdersAndLimitsType["limit"] extends ParamaterizedObservable<any, any, any>
    ? { _limit: OrdersAndLimitsType["limit"] }
    : {})

type OrderByConditions<Model extends Record<string, any>> = Partial<
  {
    [key in keyof Model]: ParamaterizedObservable<any, OrderByDirection, any>
  }
>

type OrdersAndLimits<Model extends Record<string, any>> = {
  orderBy?: OrderByConditions<Model>
  limit?: ParamaterizedObservable<any, number, any>
}

const getEmptyValuesMapFromFilterObj = <
  StartingObjType extends ModelFilter<any>
>(
  startingObj: StartingObjType
): ValuesMapFromParamObsMap<FilterTypeToParamObsMap<StartingObjType>> => {
  const argsMap = {} as ValuesMapFromParamObsMap<
    FilterTypeToParamObsMap<StartingObjType>
  >
  objKeys(startingObj).forEach((keyName) => (argsMap[keyName] = undefined))
  return argsMap
}

const isParamObs = (a: any): a is ParamaterizedObservable<any, any, any> => {
  return !!(a as ParamaterizedObservable<any, any, any>).attach
}

const getParamObsMapFromFilterObj = <StartingObjType extends ModelFilter<any>>(
  startingObj: StartingObjType
): FilterTypeToParamObsMap<StartingObjType> => {
  const paramObsMap = {} as FilterTypeToParamObsMap<StartingObjType>
  objKeys(startingObj).forEach((keyName) => {
    const value = startingObj[keyName]
    if (isParamObs(value)) {
      paramObsMap[keyName] = value as any
    } else {
      paramObsMap[keyName] = value[1].pipe(
        map((resolvedValue) => ({ _op: value[0], _value: resolvedValue }))
      ) as any
    }
  })
  return paramObsMap
}

export const filtered = <
  CollectionName extends keyof CollectionModels,
  FilterType extends ModelFilter<CollectionModels[CollectionName]> = {},
  OtherConditionsType extends OrdersAndLimits<
    CollectionModels[CollectionName]
  > = {}
>(
  collectionName: CollectionName,
  filters?: FilterType,
  otherConditions?: OtherConditionsType
): ParamaterizedObservable<
  UnionOfArgs<
    | FilterTypeToParamObsMap<FilterType>
    | OrdersAndLimitsToParamObsMap<OtherConditionsType>
  >,
  CollectionModels[CollectionName][],
  CollectionName
> => {
  filters = filters || ({} as FilterType)
  const orderByConditions =
    otherConditions?.orderBy ||
    ({} as OrderByConditions<CollectionModels[CollectionName]>)

  const filterValuesMap = getEmptyValuesMapFromFilterObj(filters)
  const orderByValuseMap = getEmptyValuesMapFromParamObsMap(orderByConditions)

  const allValuesMaps = {
    filters: filterValuesMap,
    orderBy: orderByValuseMap,
    limit: undefined as number,
  }

  const unattachedObs = buildParamaterizedObs(
    collectionName,
    allValuesMaps,
    (filterValuesObs) => {
      return filterValuesObs.pipe(
        filter((args) => {
          const filtersAreAllDefined = !objKeys(args.filters).some(
            (_) => typeof args.filters[_] === "undefined"
          )
          const orderByAreAllDefined = !objKeys(args.orderBy).some(
            (_) => typeof args.orderBy[_] === "undefined"
          )
          const limitIsDefined =
            otherConditions?.limit === undefined
              ? true
              : typeof args.limit !== "undefined"

          return filtersAreAllDefined && orderByAreAllDefined && limitIsDefined
        }),
        switchMap((values) => {
          const resolvedFilters = values.filters
          const resolvedLimit = values.limit
          const resolvedOrderBy = values.orderBy
          const filterQueries = objKeys(resolvedFilters).map(
            (fieldNameToFilterOn) => {
              const rawQueryOrValue = resolvedFilters[fieldNameToFilterOn]

              if (rawQueryOrValue?._op) {
                const { _op, _value } = rawQueryOrValue
                if (_value === null) {
                  return undefined
                } else {
                  return where(fieldNameToFilterOn as string, _op, _value)
                }
              } else {
                if (rawQueryOrValue === null) {
                  return undefined
                } else {
                  return where(
                    fieldNameToFilterOn as string,
                    "==",
                    rawQueryOrValue
                  )
                }
              }
            }
          )

          const orderByQueries = objKeys(resolvedOrderBy)
            .filter((key) => resolvedOrderBy[key])
            .map((nonNullOrderByKey) => {
              const orderByValue = resolvedOrderBy[nonNullOrderByKey]
              return orderBy(nonNullOrderByKey as string, orderByValue)
            })

          const limitQuery = resolvedLimit
            ? [limit(resolvedLimit)]
            : [undefined]

          const allQueries = [
            ...filterQueries,
            ...orderByQueries,
            ...limitQuery,
          ]

          return buildObsForCollection(collectionName, allQueries)
        })
      )
    }
  )

  const attachMap = {
    filters: combine(getParamObsMapFromFilterObj(filters)),
    orderBy: combine(orderByConditions),
    limit: otherConditions?.limit ? otherConditions.limit : staticValue(null),
  }

  return attachObs(unattachedObs, attachMap)
}

// const a = filtered(
//   "company",
//   {
//     name: settable("test"),
//     nickname: ["==", staticValue("test")],
//   }
//   {
//     orderBy: {
//       name: staticValue("asc"),
//     },
//     limit: staticValue(10),
//   }
// )

// a.attach({"test":1 })
