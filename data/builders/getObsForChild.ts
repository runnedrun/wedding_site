import { ConnectableObservable, Observable } from "rxjs"
import { Model } from "../baseTypes/Model"
import { map, tap } from "rxjs"
// import Par
import {
  ParamaterizedObservable,
  isParameterizedObservable,
} from "../ParamaterizedObservable"
import { ArgsMap } from "./ArgsMap"
import { buildParamaterizedObs } from "./buildParamterizedObs"

export const getObsForChild = <
  K extends keyof M,
  M extends Model<any, any>,
  P extends ArgsMap | {},
  Name extends string
>(
  obs: ParamaterizedObservable<P, M, Name> | Observable<M>,
  childKey: K
): ParamaterizedObservable<P, M[K], K> => {
  if (isParameterizedObservable(obs)) {
    const newObs = obs
      .pipe(
        map((value) => {
          return value && value[childKey]
        })
      )
      .withName(childKey)

    return newObs
  } else {
    return buildParamaterizedObs(childKey, {} as P, () => {
      return obs.pipe(
        map((value) => {
          return value && value[childKey]
        })
      )
    }) as ParamaterizedObservable<P, M[K], K>
  }
}
