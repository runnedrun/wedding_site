import { buildObservableQueryConstraint } from "./buildObservableQueryConstraint"
import { Observable } from "rxjs"
import { where } from "@firebase/firestore"

export function buildObsWhereIn<T, ObsType extends Observable<T>>(
  fieldName: string,
  obs: ObsType
) {
  return buildObservableQueryConstraint(obs, (key) => {
    return where(fieldName, "array-contains", key || "_NEVER_EVER")
  })
}
