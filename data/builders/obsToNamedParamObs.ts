import { Observable } from "rxjs"
import { buildParamaterizedObs } from "./buildParamterizedObs"

export const obsToNamedParamObs = <M, Name extends string>(
  obs: Observable<M>,
  name: Name
) => {
  return buildParamaterizedObs(name, {}, () => {
    return obs
  })
}
