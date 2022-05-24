import { Observable, of } from "rxjs"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"

export const staticValue = <ValueType extends any>(
  value: ValueType
): ParamaterizedObservable<{}, ValueType, any> => {
  return buildParamaterizedObs(`staticValue-${value}`, {}, () => {
    return of(value)
  })
}
