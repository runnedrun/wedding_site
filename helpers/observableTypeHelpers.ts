import { ParamaterizedObservable } from "@/data/ParamaterizedObservable"
import { Observable } from "rxjs"
import {
  ModelFromParamObs,
  ModelFromArrayParamObs,
} from "./paramObsTypeHelpers"

export type ModelFromObservable<
  Obs extends Observable<any>
> = Obs extends Observable<infer Type> ? Type : never

export type ModelFromArrayObservable<
  Obs extends Observable<any>
> = Obs extends Observable<(infer Type)[]> ? Type : never

export type ModelFromObservableOrParamObservable<
  Obs extends Observable<any>
> = Obs extends ParamaterizedObservable<any, any, any>
  ? ModelFromParamObs<Obs>
  : ModelFromObservable<Obs>

export type ModelFromArrayObservableOrParamObservable<
  Obs extends Observable<any>
> = Obs extends ParamaterizedObservable<any, any, any>
  ? ModelFromArrayParamObs<Obs>
  : ModelFromArrayObservable<Obs>

export type ObservableMapFromMapOfObservables<
  ObsMap extends Record<string, Observable<any>>
> = Observable<
  {
    [key in keyof ObsMap]: ModelFromObservable<ObsMap[key]>
  }
>
