import { Observable } from "rxjs/internal/Observable"
import { ValuesType } from "utility-types"
import { ParamaterizedObservable } from "../ParamaterizedObservable"

export type ParamObsMap = Record<string, ParamaterizedObservable<any, any, any>>

export type ArgsTypeFromParamObs<
  ParamObs extends ParamaterizedObservable<any, any, any>
> = ParamObs extends ParamaterizedObservable<infer ArgsType, any, any>
  ? ArgsType
  : never

export type ValueTypeFromParamObs<
  ParamObs extends ParamaterizedObservable<any, any, any>
> = ParamObs extends ParamaterizedObservable<any, infer ValueType, any>
  ? ValueType
  : never

export type NameTypeFromParamObs<
  ParamObs extends ParamaterizedObservable<any, any, any>
> = ParamObs extends ParamaterizedObservable<any, any, infer NameType>
  ? NameType
  : never

export type ValuesMapFromParamObsMap<Map extends ParamObsMap> = {
  [key in keyof Map]: ValueTypeFromParamObs<Map[key]>
}

export type ArgsMapFromParamObsMap<Map extends ParamObsMap> = {
  [key in keyof Map]: ArgsTypeFromParamObs<Map[key]>
}

export type UnionOfArgs<Map extends ParamObsMap> = ValuesType<
  ArgsMapFromParamObsMap<Map>
> extends never
  ? {}
  : ValuesType<ArgsMapFromParamObsMap<Map>>

export type ObservableMap<ArgsType> = {
  [key in keyof ArgsType]: Observable<ArgsType[key]>
}

export type RecordParamObs = ParamaterizedObservable<
  Record<any, any>,
  Record<any, any>,
  any
>

export type ValueTypeFromArrayParamObs<
  ParamObs extends ParamaterizedObservable<any, Record<any, any>[], any>
> = ParamObs extends ParamaterizedObservable<any, Array<infer ModelType>, any>
  ? ModelType
  : never
