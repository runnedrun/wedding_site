import { combineLatest, of, switchMap } from "rxjs"
import { PathMapToCollectionName } from "../baseTypes/ForeignKey"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import {
  ArgsTypeFromParamObs,
  ValueTypeFromArrayParamObs,
} from "../paramObsBuilders/ParamObsTypeUtils"
import { GetHydratedValue, hydrateObj } from "./hydrate"

type ReturnType<
  ParamObs extends ParamaterizedObservable<any, Record<string, any>[], any>,
  PathMapToHydrate extends Record<string, any>
> = ParamaterizedObservable<
  ArgsTypeFromParamObs<ParamObs>,
  GetHydratedValue<ValueTypeFromArrayParamObs<ParamObs>, PathMapToHydrate>[],
  any
>

export const hydrateArray = <
  ParamObsType extends ParamaterizedObservable<any, Record<string, any>[], any>
>(
  paramObs: ParamObsType
) => <
  PathMapToHydrate extends Partial<
    PathMapToCollectionName<ValueTypeFromArrayParamObs<ParamObsType>>
  >
>(
  hydrationPathMap: PathMapToHydrate
): ReturnType<ParamObsType, PathMapToHydrate> => {
  return paramObs.pipe(
    switchMap((values) => {
      return values.length
        ? combineLatest(
            values.map((value) => hydrateObj(value)(hydrationPathMap))
          )
        : of([])
    })
  ) as ReturnType<ParamObsType, PathMapToHydrate>
}
