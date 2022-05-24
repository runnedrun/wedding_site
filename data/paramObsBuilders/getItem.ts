import { docListToMap } from "@/helpers/docListToMap"
import { map, switchMap } from "rxjs"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { attachObs } from "./attachObs"
import {
  ArgsTypeFromParamObs,
  RecordParamObs,
  ValueTypeFromParamObs,
} from "./ParamObsTypeUtils"

export type ReturnType<
  ParamObsType extends RecordParamObs
> = ParamaterizedObservable<
  ArgsTypeFromParamObs<ParamObsType> & { key: string },
  ValueTypeFromParamObs<ParamObsType> extends Record<any, infer ValueType>
    ? ValueType
    : never,
  any
>

export const getItem = <ParamObs extends RecordParamObs>(
  recordParamObs: ParamObs
): ReturnType<ParamObs> => {
  return buildParamaterizedObs(
    "getItem",
    { ...recordParamObs.originalArgs, key: undefined as string },
    (args) => {
      return recordParamObs.attach(args).pipe(
        switchMap((res) => {
          return args.pipe(
            map(({ key }) => {
              return res[key]
            })
          )
        })
      )
    }
  ) as ReturnType<ParamObs>
}

// type U = ParamaterizedObservable<{ a: 1 }, { "1": 1; 2: 4 }, any>
// type T = ParamaterizedObservable<{}, string, any>

// const i = {} as U

// const y = attachObs(getItem(i), { key: {} as T })
