export const filterUndefFromObj = <ObjType extends object>(object: ObjType) => {
  const keys = Object.keys(object) as (keyof typeof object)[]
  return keys
    .filter((key) => {
      const value = object[key]
      return typeof value !== "undefined"
    })
    .reduce((builder, key) => {
      builder[key] = object[key]
      return builder
    }, {} as ObjType)
}

export const filterUndefFromArr = <ArrayType extends [...any]>(
  arr: ArrayType
) => {
  return arr.filter((item) => {
    return typeof item !== "undefined"
  })
}

export const objHasUndef = (obj: any) => {
  return Object.keys(filterUndefFromObj(obj)).length < Object.keys(obj).length
}
