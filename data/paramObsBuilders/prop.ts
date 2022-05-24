import { SingleArgObject } from "@/helpers/SingleArgObject"
import { map } from "rxjs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { PropArg, propSpecialArg } from "./propSpecialArg"
import { settable } from "./settable"

export const prop = <ValueType extends any, NameType extends string>(
  name: NameType,
  defaultValue?: ValueType
) => {
  return settable(name, propSpecialArg(name, defaultValue)).pipe(
    map((_) => _._value)
  )
}
