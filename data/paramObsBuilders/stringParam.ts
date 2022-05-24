import { isServerside } from "@/helpers/isServerside"
import { readonlyQueryParam } from "./readonlyQueryParam"
import { writableQueryParam } from "./writableQueryParam"

export const stringParam = <Name extends string, ValueType extends string>(
  name: Name,
  defaultValue?: ValueType
) => {
  return readonlyQueryParam<ValueType, Name>(
    name,
    typeof defaultValue === "undefined" ? null : defaultValue,
    (value) => value as ValueType
  )
}

export const writableStringParam = <
  Name extends string,
  ValueType extends string
>(
  name: Name,
  defaultValue?: ValueType
) => {
  return writableQueryParam<ValueType, Name>(
    name,
    typeof defaultValue === "undefined" ? null : defaultValue,
    (value) => value as ValueType
  )
}
