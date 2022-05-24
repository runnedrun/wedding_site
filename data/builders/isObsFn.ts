import { Observable } from "rxjs"

export const isObsFn = <M>(
  obs: (...any) => Observable<M> | M
): obs is (...any) => Observable<M> => {
  return typeof (obs as () => Observable<M>) === "function"
}
