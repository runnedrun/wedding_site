import { objKeys } from "@/helpers/objKeys"
import { combineLatest, map, Observable, tap } from "rxjs"
import { UnionToIntersection } from "utility-types"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { attachObs } from "./attachObs"
import {
  ValuesMapFromParamObsMap,
  ParamObsMap,
  UnionOfArgs,
} from "./ParamObsTypeUtils"

export type CombinedParamObs<Map extends ParamObsMap> = ParamaterizedObservable<
  UnionToIntersection<UnionOfArgs<Map>>,
  ValuesMapFromParamObsMap<Map>,
  any
>

export const combine = <InputMap extends ParamObsMap>(
  obsToCombine: InputMap
): CombinedParamObs<InputMap> => {
  const values = {} as ValuesMapFromParamObsMap<InputMap>

  const unattachedCombinedObs = buildParamaterizedObs(
    "combined",
    values,
    (argsObs) => {
      return argsObs as Observable<ValuesMapFromParamObsMap<InputMap>>
    }
  )

  return attachObs(
    unattachedCombinedObs,
    obsToCombine
  ) as CombinedParamObs<InputMap>
}
