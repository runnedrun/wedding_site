import { ForeignKey } from "../baseTypes/ForeignKey"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { CollectionModels } from "./CollectionModels"
import { doc } from "./doc"
import { attachObs } from "../paramObsBuilders/attachObs"

export const docForKey = <
  CollectionName extends keyof CollectionModels,
  ArgsForKeyParamObs extends any
>(
  collectionName: CollectionName,
  key: ParamaterizedObservable<ArgsForKeyParamObs, ForeignKey<any>, any>
) => {
  return attachObs(doc(collectionName), {
    key,
  })
}
