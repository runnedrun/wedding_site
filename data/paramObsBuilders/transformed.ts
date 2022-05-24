import { objKeys } from "@/helpers/objKeys"
import { combineLatest, map, Observable, tap } from "rxjs"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"

export const transformed = <
  Inputs extends Record<string, any>,
  Transform extends (input: Inputs) => OutputType,
  OutputType extends any
>(
  input: Inputs,
  transform?: Transform
): ParamaterizedObservable<Inputs, OutputType, "transform"> => {
  if (!transform) {
    transform = ((input: Inputs) => input) as Transform
  }

  const obs = buildParamaterizedObs("transform", input, (argsObs) => {
    return argsObs.pipe(map(transform))
  })

  return obs
}
