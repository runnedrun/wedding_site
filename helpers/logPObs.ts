import { Observable, tap } from "rxjs"
import { ParamaterizedObservable } from "@/data/ParamaterizedObservable"

export const log = (obs: Observable<any>, extraMessage?: string) => {
  const asParamObs = obs as ParamaterizedObservable<any, any, any>
  return asParamObs.pipe(
    tap((data) =>
      console.log(extraMessage || `obsData for: ${asParamObs.name}`, data)
    )
  )
}
