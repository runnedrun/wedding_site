import { readonlyQueryParam } from "./readonlyQueryParam"
import { writableQueryParam } from "./writableQueryParam"

export const readOnlyBoolParam = <NameType extends string>(
  name: NameType,
  defaultValue: boolean
) => {
  return readonlyQueryParam<boolean, NameType>(name, defaultValue, (value) => {
    return value === "true"
  })
}

export const boolParam = <NameType extends string>(
  name: NameType,
  defaultValue: boolean
) => {
  return writableQueryParam<boolean, NameType>(name, defaultValue, (value) => {
    return value === "true"
  })
}
