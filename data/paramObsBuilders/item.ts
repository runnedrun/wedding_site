import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { getItem } from "./getItem"
import {
  ArgsTypeFromParamObs,
  RecordParamObs,
  ValueTypeFromParamObs,
} from "./ParamObsTypeUtils"
import { attachObs } from "./attachObs"

// export type ItemParamObs<> =

export const item = <
  ParamObsType extends RecordParamObs,
  KeyObsType extends ParamaterizedObservable<
    any,
    Extract<keyof ValueTypeFromParamObs<ParamObsType>, string>,
    any
  >
>(
  paramObs: ParamObsType,
  keyObs: KeyObsType
): ParamaterizedObservable<
  ArgsTypeFromParamObs<KeyObsType>,
  ValueTypeFromParamObs<ParamObsType>[ValueTypeFromParamObs<KeyObsType>],
  any
> => {
  const args = {
    key: keyObs,
  } as any

  return attachObs(getItem(paramObs), args) as ParamaterizedObservable<
    ArgsTypeFromParamObs<KeyObsType>,
    ValueTypeFromParamObs<ParamObsType>[ValueTypeFromParamObs<KeyObsType>],
    any
  >
}
