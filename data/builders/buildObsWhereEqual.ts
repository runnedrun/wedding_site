import { buildObservableQueryConstraint } from "./buildObservableQueryConstraint"
import { Observable } from "rxjs"
import { where } from "@firebase/firestore"

export function buildObsWhereEqual<T, ObsType extends Observable<T>>(
  fieldName: string,
  obs: ObsType
) {
  return buildObservableQueryConstraint(obs, (key) => {
    if (typeof key === "undefined" || key === null) {
      return undefined
    } else {
      return where(fieldName, "==", key)
    }
  })
}
