import { QueryConstraint } from "@firebase/firestore"
import { Observable, map } from "rxjs"

export const buildObservableQueryConstraint = <
  T,
  ObsType extends Observable<T>
>(
  obs: ObsType,
  buildConstraint: (res: T | undefined) => QueryConstraint
): Observable<QueryConstraint> => obs?.pipe(map((res) => buildConstraint(res)))
