import { combineLatest, map, switchMap, tap } from "rxjs"
import { UnionToIntersection } from "utility-types"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import {
  ArgsTypeFromParamObs,
  RecordParamObs,
  ValueTypeFromParamObs,
} from "./ParamObsTypeUtils"

type AssignTwoRecordParamObs<
  ParamObs1 extends RecordParamObs,
  ParamObs2 extends RecordParamObs
> = ParamaterizedObservable<
  UnionToIntersection<ArgsTypeFromParamObs<ParamObs1>> &
    UnionToIntersection<ArgsTypeFromParamObs<ParamObs2>>,
  ValueTypeFromParamObs<ParamObs1> & ValueTypeFromParamObs<ParamObs2>,
  any
>

export const assign = <
  Obs1Type extends RecordParamObs,
  Obs2Type extends RecordParamObs
>(
  obs1: Obs1Type,
  obs2: Obs2Type
): AssignTwoRecordParamObs<Obs1Type, Obs2Type> => {
  return buildParamaterizedObs(
    "assigned",
    { ...obs1.getCurrentParams(), ...obs2.getCurrentParams() },
    (args) => {
      return args.pipe(
        tap((args) => {
          obs1.attach(args)
          obs2.attach(args)
        }),
        switchMap(() => {
          return combineLatest([obs1.obs(), obs2.obs()]).pipe(
            map((data) => {
              const [obs1Data, obs2Data] = data
              return { ...obs1Data, ...obs2Data }
            })
          )
        })
      )
    }
  ) as AssignTwoRecordParamObs<Obs1Type, Obs2Type>
}
