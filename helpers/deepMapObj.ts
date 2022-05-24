import { forOwn, isPlainObject } from "lodash"

export const deepMapObj = (obj: any, mapper: (key: any) => any) => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  const objIsArray = typeof obj.length !== "undefined"

  const newObj = objIsArray ? [] : {}

  forOwn(obj, function (value, key) {
    const valueIsArray = typeof value?.length !== "undefined"
    const newValue = mapper(value)
    if (typeof newValue !== "undefined") {
      newObj[key] = newValue
      return
    } else if (isPlainObject(value) || valueIsArray) {
      newObj[key] = deepMapObj(value, mapper)
    } else {
      newObj[key] = value
    }
  })

  return newObj
}
