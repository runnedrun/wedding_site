import {
  buildSingleArgObject,
  SingleArgObject,
} from "@/helpers/SingleArgObject"
import { map } from "rxjs"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"

export const settable = <ValueType extends any, NameType extends string>(
  name: NameType,
  defaultValue?: ValueType
): ParamaterizedObservable<
  SingleArgObject<NameType, ValueType>,
  ValueType,
  any
> => {
  const args = buildSingleArgObject(
    name,
    typeof defaultValue === "undefined" ? null : defaultValue
  )
  return buildParamaterizedObs("settable", args, (value) =>
    value.pipe(map((_) => _[name]))
  )
}
