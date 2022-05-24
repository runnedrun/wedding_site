import { deepMapObj } from "@/helpers/deepMapObj"
import { Timestamp } from "@firebase/firestore"

export const jsonifyTimestamps = (obj: any) => {
  return deepMapObj(obj, (nestedValue) => {
    if (
      typeof nestedValue?.nanoseconds !== "undefined" &&
      typeof nestedValue?.seconds !== "undefined"
    ) {
      return {
        value: nestedValue.toMillis(),
        __convertToDate: true,
      }
    } else if (typeof nestedValue?._key !== "undefined") {
      return nestedValue.path
    }
  })
}

export const hydrateTimestamps = (obj: any) => {
  return deepMapObj(obj || {}, (value) => {
    if (value?.__convertToDate) {
      return Timestamp.fromMillis(value.value)
    }
  })
}
