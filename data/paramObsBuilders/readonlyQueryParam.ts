import { SingleArgObject } from "@/helpers/SingleArgObject"
import { map, tap } from "rxjs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { ReadOnlyArg, readonlySpecialArg } from "./readonlySpecialArg"
import { settable } from "./settable"

export const readonlyQueryParam = <
  ValueType extends any,
  NameType extends string
>(
  name: NameType,
  defaultValue: ValueType,
  processQueryValue: (query: string) => ValueType
): ParamaterizedObservable<
  SingleArgObject<NameType, ReadOnlyArg<ValueType>>,
  ValueType,
  any
> => {
  const value = readonlySpecialArg(defaultValue, (currentValue, context) => {
    if (!context.triggeredByContextUpdate) {
      return currentValue
    }

    const param = context.query[name]
    if (typeof param === "undefined" || param === "") {
      return defaultValue
    } else {
      return processQueryValue(param)
    }
  })

  return settable(name, value).pipe(map((_) => _._value))
}
