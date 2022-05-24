import { CountdownType } from "@/helpers/countdownType"
import { objKeys } from "@/helpers/objKeys"
import { update } from "lodash"
import { combineLatest, map, switchMap, of, Observable, tap } from "rxjs"
import {
  PathMapToCollectionName,
  PathMapToForeignKeyData,
} from "../baseTypes/ForeignKey"
import { buildObsForDoc } from "../builders/buildObsForDoc"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import {
  ArgsTypeFromParamObs,
  ValueTypeFromParamObs,
} from "../paramObsBuilders/ParamObsTypeUtils"
import { CollectionModels } from "./CollectionModels"

type RecordValueParamObs = ParamaterizedObservable<any, Record<any, any>, any>

type HydratedParamObs<
  ParamObs extends RecordValueParamObs,
  HydratedPaths extends Record<string, any>
> = ParamaterizedObservable<
  ArgsTypeFromParamObs<ParamObs>,
  GetHydratedValue<ValueTypeFromParamObs<ParamObs>, HydratedPaths>,
  "hydrated"
>

export type GetHydratedValueForKey<
  HydratedPaths extends string,
  OriginalObj extends Record<any, any>,
  key extends string,
  Path extends string = "",
  I extends number = 5
> = `${Path}${key}` extends keyof PathMapToForeignKeyData<OriginalObj>
  ? PathMapToForeignKeyData<OriginalObj>[`${Path}${key}`]["_referenceType"] extends any[]
    ? RecursivelyGetHydratedValues<
        HydratedPaths,
        OriginalObj,
        PathMapToForeignKeyData<OriginalObj>[`${Path}${key}`]["_model"],
        `${Path}${key}.`,
        CountdownType[I]
      >[]
    : RecursivelyGetHydratedValues<
        HydratedPaths,
        OriginalObj,
        PathMapToForeignKeyData<OriginalObj>[`${Path}${key}`]["_model"],
        `${Path}${key}.`,
        CountdownType[I]
      >
  : never

export type RecursivelyGetHydratedValues<
  HydratedPaths extends string,
  OriginalObj extends Record<any, any>,
  Obj extends Record<any, any>,
  Path extends string = "",
  I extends number = 5
> = Obj & {
  hydrated: [I] extends [never]
    ? never
    : {
        [key in Extract<
          keyof Obj,
          string
        > as `${Path}${key}` extends keyof PathMapToForeignKeyData<OriginalObj> &
          HydratedPaths
          ? key
          : never]: GetHydratedValueForKey<
          HydratedPaths,
          OriginalObj,
          key,
          Path,
          I
        >
      }
}

export type GetHydratedValue<
  ObjType extends Record<string, any>,
  PathMap extends Record<string, any>
> = RecursivelyGetHydratedValues<
  Extract<keyof PathMap, string>,
  ObjType,
  ObjType
>

export const hydrateObj = <ObjType extends Record<string, any>>(
  obj: ObjType
) => <PathMapToHydrate extends Partial<PathMapToCollectionName<ObjType>>>(
  hydrationPathMap: PathMapToHydrate
): Observable<GetHydratedValue<ObjType, PathMapToHydrate>> => {
  const hydrationMap = {}
  objKeys(hydrationPathMap).forEach((key) => {
    update(hydrationMap, key, () => false)
  })

  const hydrateTree = (
    objToHydrate: Record<string, any>,
    treeOfKeysToHydrate: Record<string, any>,
    basePath = ""
  ) => {
    const keysToHydrate = objKeys(treeOfKeysToHydrate)
    const obsForHydratedKeys = keysToHydrate.map((keyToHydrate) => {
      const pathToHydrate = `${basePath}${keyToHydrate}`
      const collectionName = hydrationPathMap[
        pathToHydrate
      ] as keyof CollectionModels

      const hydrateForeignKey = (
        keyToHydrateName: string,
        foreignKeyValue: string
      ): Observable<any> =>
        buildObsForDoc(collectionName, foreignKeyValue).pipe(
          switchMap((hydratedValue) => {
            const nextTreeToHydrate = treeOfKeysToHydrate[keyToHydrateName]
            if (nextTreeToHydrate) {
              return hydrateTree(
                hydratedValue,
                nextTreeToHydrate,
                `${basePath}${keyToHydrate}.`
              )
            } else {
              return of(hydratedValue)
            }
          })
        )

      const foreignKeyOrKeys = objToHydrate[keyToHydrate]

      if (Array.isArray(foreignKeyOrKeys)) {
        return foreignKeyOrKeys.length
          ? combineLatest(
              foreignKeyOrKeys.map((foreignKey) => {
                return hydrateForeignKey(keyToHydrate, foreignKey)
              })
            )
          : of([])
      } else {
        return hydrateForeignKey(keyToHydrate, foreignKeyOrKeys)
      }
    })

    const allHydrationComplete = obsForHydratedKeys
      ? combineLatest(obsForHydratedKeys)
      : of([])

    return allHydrationComplete.pipe(
      map((hydratedValues: any[]) => {
        const objWithHydratedValues = { ...objToHydrate } as GetHydratedValue<
          ObjType,
          PathMapToHydrate
        >
        hydratedValues.forEach((hydratedValue, i) => {
          const keyForThisValue = keysToHydrate[i]
          objWithHydratedValues["hydrated"] =
            objWithHydratedValues["hydrated"] ||
            ({} as GetHydratedValue<ObjType, PathMapToHydrate>["hydrated"])
          objWithHydratedValues["hydrated"][keyForThisValue] = hydratedValue
        })
        return objWithHydratedValues
      })
    )
  }

  return obj
    ? hydrateTree({ ...obj }, hydrationMap)
    : (of(obj) as Observable<GetHydratedValue<ObjType, PathMapToHydrate>>)
}

export const hydrate = <ParamObsType extends RecordValueParamObs>(
  obs: ParamObsType
) => <
  PathMapToHydrate extends Partial<
    PathMapToCollectionName<ValueTypeFromParamObs<ParamObsType>>
  >
>(
  hydrationPathMap: PathMapToHydrate
): HydratedParamObs<ParamObsType, PathMapToHydrate> => {
  const hydratedObs = obs.pipe(
    switchMap((value) => hydrateObj(value)(hydrationPathMap))
  )
  return hydratedObs as HydratedParamObs<ParamObsType, PathMapToHydrate>
}
