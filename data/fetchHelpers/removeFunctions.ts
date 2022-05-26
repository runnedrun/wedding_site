import { deepMapObj, DeleteField } from "@/helpers/deepMapObj"

export const removeFunctionsFromObj = (obj: any) => {
  return deepMapObj({ ...obj }, (_) => {
    return typeof _ === "function" ? DeleteField : undefined
  })
}
