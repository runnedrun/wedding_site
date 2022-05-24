import { deepMapObj } from "@/helpers/deepMapObj"

export const removeFunctionsFromObj = (obj: any) => {
  return deepMapObj({ ...obj }, (_) => {
    return typeof _ === "function" ? null : undefined
  })
}
