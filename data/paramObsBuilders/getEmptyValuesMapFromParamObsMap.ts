import { objKeys } from "@/helpers/objKeys"
import { ValuesMapFromParamObsMap, ParamObsMap } from "./ParamObsTypeUtils"

export const getEmptyValuesMapFromParamObsMap = <
  StartingObjType extends ParamObsMap
>(
  startingObj: StartingObjType
): ValuesMapFromParamObsMap<StartingObjType> => {
  const argsMap = {} as ValuesMapFromParamObsMap<StartingObjType>
  objKeys(startingObj).forEach((keyName) => (argsMap[keyName] = undefined))
  return argsMap
}
