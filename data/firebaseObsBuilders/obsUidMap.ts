import {
  ModelFromArrayObservable,
  ModelFromArrayObservableOrParamObservable,
} from "@/helpers/observableTypeHelpers"
import { ModelFromArrayParamObs } from "@/helpers/paramObsTypeHelpers"
import { map, Observable } from "rxjs"
import { ValuesType } from "utility-types"
import { ArgsMap } from "../builders/ArgsMap"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { Model } from "../baseTypes/Model"
import { AllModels } from "./CollectionModels"
import {
  ArgsTypeFromParamObs,
  NameTypeFromParamObs,
} from "../paramObsBuilders/ParamObsTypeUtils"

export const obsUidMap = <
  InputType extends ParamaterizedObservable<any, any, any> | Observable<any>
>(
  arrayObs: InputType
): InputType extends ParamaterizedObservable<any, any, any>
  ? ParamaterizedObservable<
      ArgsTypeFromParamObs<InputType>,
      Record<string, ModelFromArrayParamObs<InputType>>,
      NameTypeFromParamObs<InputType>
    >
  : Observable<Record<string, ModelFromArrayObservable<InputType>>> => {
  type ModelType = ModelFromArrayObservableOrParamObservable<InputType>
  const returnObs = arrayObs.pipe(
    map((items) => {
      const correctItems = items as ModelType[]
      const mapping = {} as {
        [key: string]: ModelType
      }
      correctItems.forEach((item: Model<any, any>) => {
        if (item) {
          mapping[item.uid] = item
        }
      })
      return mapping
    })
  )

  return returnObs as InputType extends ParamaterizedObservable<any, any, any>
    ? ParamaterizedObservable<
        ArgsTypeFromParamObs<InputType>,
        Record<string, ModelFromArrayParamObs<InputType>>,
        NameTypeFromParamObs<InputType>
      >
    : Observable<Record<string, ModelFromArrayObservable<InputType>>>
}
