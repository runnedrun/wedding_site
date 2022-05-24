import { SingleArgObject } from "@/helpers/SingleArgObject"
import { tap } from "rxjs"
import { Model } from "../baseTypes/Model"
import { obsUidMap } from "../firebaseObsBuilders/obsUidMap"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { item } from "../paramObsBuilders/item"
import { ValueTypeFromParamObs } from "../paramObsBuilders/ParamObsTypeUtils"
import { prop } from "../paramObsBuilders/prop"
import { PropArg } from "../paramObsBuilders/propSpecialArg"

export const getItemFromModelList = <
  ParamObsType extends ParamaterizedObservable<
    Record<any, any>,
    Model<any, any>[],
    any
  >,
  PropName extends string
>(
  data: ParamObsType,
  propKey: PropName
): ParamaterizedObservable<
  SingleArgObject<PropName, PropArg<string>>,
  ValueTypeFromParamObs<ParamObsType>[number],
  any
> => {
  const dataItem = obsUidMap(data)
  return item(dataItem, prop(propKey, undefined as any)) as any
}
