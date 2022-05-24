import { objKeys } from "@/helpers/objKeys"
import { ObservableMapFromMapOfObservables } from "@/helpers/observableTypeHelpers"
import { ConsoleView } from "react-device-detect"
import {
  combineLatest,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { combine } from "./combine"
import {
  ArgsTypeFromParamObs,
  NameTypeFromParamObs,
  UnionOfArgs,
  ValueTypeFromParamObs,
} from "./ParamObsTypeUtils"

export type AttachedObs<
  ParamObsType extends ParamaterizedObservable<any, any, any>,
  AttachMapType extends Partial<
    Record<
      keyof ArgsTypeFromParamObs<ParamObsType>,
      ParamaterizedObservable<any, any, any>
    >
  >
> = ParamaterizedObservable<
  Omit<ArgsTypeFromParamObs<ParamObsType>, keyof AttachMapType> &
    UnionOfArgs<AttachMapType>,
  ValueTypeFromParamObs<ParamObsType>,
  NameTypeFromParamObs<ParamObsType>
>

export const attachObs = <
  ParamObsType extends ParamaterizedObservable<any, any, any>,
  AttachMapType extends Partial<
    Record<
      keyof ArgsTypeFromParamObs<ParamObsType>,
      ParamaterizedObservable<any, any, any>
    >
  >
>(
  paramObs: ParamObsType,
  attachMap: AttachMapType
): AttachedObs<ParamObsType, AttachMapType> => {
  const originalObsMapClone = paramObs.originalArgs
  let unionOfNewArgs = {} as UnionOfArgs<AttachMapType>

  objKeys(attachMap).forEach((argToReplace) => {
    const obsToAttach = attachMap[argToReplace]
    if (!obsToAttach) return
    delete originalObsMapClone[argToReplace]
    unionOfNewArgs = { ...unionOfNewArgs, ...obsToAttach.originalArgs }
  })

  const replacedKeysDeleted = { ...originalObsMapClone } as Omit<
    ArgsTypeFromParamObs<ParamObsType>,
    keyof AttachMapType
  >

  const newObsMap = {
    ...replacedKeysDeleted,
    ...unionOfNewArgs,
  }

  return buildParamaterizedObs(paramObs.name, newObsMap, (obsForAllParams) => {
    const sub = obsForAllParams.subscribe((allParamValues) => {
      objKeys(allParamValues).forEach((argName) => {
        const value = allParamValues[argName]
        objKeys(attachMap).forEach((replacingArg) => {
          const attachingOb = attachMap[replacingArg]
          if ((argName as string) in attachingOb.originalArgs) {
            attachingOb.attach({ [argName]: value })
          }
        })
      })
    })

    const valueObsArray = Object.values(attachMap)

    const obsWithallParamValues = valueObsArray.length
      ? combineLatest(valueObsArray)
      : of([])

    const newArgsObs = combineLatest([
      obsForAllParams,
      obsWithallParamValues,
    ]).pipe(
      map(([allParamValues, attachedObsValues]) => {
        const keysToReplace = objKeys(attachMap)

        const attachedObsArgsRemoved = { ...allParamValues } as Omit<
          ArgsTypeFromParamObs<ParamObsType>,
          keyof AttachMapType
        > &
          UnionOfArgs<AttachMapType>

        objKeys(allParamValues).forEach((argName) => {
          objKeys(attachMap).forEach((replacingArg) => {
            const attachingOb = attachMap[replacingArg]
            if ((argName as string) in attachingOb.originalArgs) {
              delete attachedObsArgsRemoved[argName]
            }
          })
        })

        const valuesFromAttachedObs = {} as AttachMapType
        keysToReplace.forEach((key, i) => {
          valuesFromAttachedObs[key] = attachedObsValues[i]
        })

        return { ...attachedObsArgsRemoved, ...valuesFromAttachedObs }
      }),
      finalize(() => {
        sub.unsubscribe()
      })
    )
    return paramObs.build(newArgsObs)
  })
}

// export const attachObs = <
//   ParamObsType extends ParamaterizedObservable<any, any, any>,
//   AttachMapType extends Partial<
//     Record<
//       keyof ArgsTypeFromParamObs<ParamObsType>,
//       ParamaterizedObservable<any, string, any>
//     >
//   >
// >(
//   paramObs: ParamObsType,
//   attachMap: AttachMapType
// ): Value => {
//   return {} as ModelType
// }

// type AType = { test: string; test2: string }

// type MType = { model1: 5 }

// const test = {} as ParamaterizedObservable<AType, MType, "test">

// const attached = {} as ParamaterizedObservable<
//   { test3: string },
//   string,
//   "test"
// >

// const y = attachObs(test, {
//   test2: attached,
// })
