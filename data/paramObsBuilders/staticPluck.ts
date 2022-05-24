import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { RecordParamObs, ValueTypeFromParamObs } from "./ParamObsTypeUtils"
import { pluck as rxPluck } from "rxjs"

export const staticPluck = <
  ParamObsType extends RecordParamObs,
  KeyName extends keyof ValueTypeFromParamObs<ParamObsType>
>(
  paramObs: ParamObsType,
  keyName: KeyName
) => {
  const obs = paramObs.pipe(rxPluck(keyName)) as ParamaterizedObservable<
    {},
    ValueTypeFromParamObs<ParamObsType>[KeyName],
    any
  >
  return obs
}
