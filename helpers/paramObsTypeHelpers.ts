import { ParamaterizedObservable } from "@/data/ParamaterizedObservable"

export type ModelFromParamObs<
  ParamObs extends ParamaterizedObservable<any, any, any>
> = ParamObs extends ParamaterizedObservable<any, infer ModelType, any>
  ? ModelType
  : never

export type ModelFromArrayParamObs<
  ParamObs extends ParamaterizedObservable<any, any, any>
> = ParamObs extends ParamaterizedObservable<any, (infer ModelType)[], any>
  ? ModelType
  : never
