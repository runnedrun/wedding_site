import {
  Observable,
  BehaviorSubject,
  OperatorFunction,
  firstValueFrom,
  filter,
  shareReplay,
  tap,
} from "rxjs"
import {
  ParamaterizedObservable,
  AttachFunctionType,
  KeyType,
} from "../ParamaterizedObservable"
import { ArgsMap, ValueType } from "@/data/builders/ArgsMap"

import { filterUndefFromObj, objHasUndef } from "@/helpers/filterUndef"
import { isEqual, pickBy } from "lodash"
import { deepMapObj } from "@/helpers/deepMapObj"

export const buildParamaterizedObs = <
  M,
  ArgsType extends ArgsMap,
  Name extends KeyType
>(
  name: Name,
  args: ArgsType,
  buildObs: (observableArgs: Observable<Partial<ArgsType>>) => Observable<M>
): ParamaterizedObservable<ArgsType, M, Name> => {
  const argsSubject: BehaviorSubject<ArgsType> = new BehaviorSubject<ValueType>(
    args
  )

  const filterUndefSubjectMap = argsSubject.pipe(
    filter((value) => {
      return (
        !objHasUndef(value) && !Object.values(value).some((_) => _?._skipArg)
      )
    })
  )

  let inFlight = false
  const originalObs = buildObs(filterUndefSubjectMap).pipe(
    tap((value) => {
      inFlight = false
    }),
    shareReplay(1),
    filter((value) => {
      return !inFlight
    })
  )

  return buildParamObsFromObs(originalObs, args, buildObs, argsSubject, name)
}

const buildParamObsFromObs = <ArgsType, M extends any, Name extends KeyType>(
  originalObs: Observable<M>,
  originalArgs: ArgsType,
  buildObs: (observableArgs: Observable<Partial<ArgsType>>) => Observable<M>,
  argsSubject: BehaviorSubject<ArgsType>,
  name: KeyType
): ParamaterizedObservable<ArgsType, M, Name> => {
  const getCurrentArgMap = () => argsSubject.getValue()

  const paramObs = (originalObs as unknown) as ParamaterizedObservable<
    ArgsType,
    M,
    Name
  >

  let inFlight = false
  const attach: AttachFunctionType<ArgsType, M, Name> = (newArgs) => {
    const noUndef = filterUndefFromObj(newArgs)
    const noExtraneousArgs = pickBy(
      noUndef,
      (value, key) => key in originalArgs
    )

    const newObj = { ...getCurrentArgMap(), ...noExtraneousArgs }

    const newObjNoFunc = deepMapObj(newObj, (_) => {
      return typeof _ === "function" ? null : undefined
    })

    const current = deepMapObj(getCurrentArgMap(), (_) =>
      typeof _ === "function" ? null : undefined
    )

    if (!isEqual(newObjNoFunc, current)) {
      inFlight = true
      argsSubject.next(newObj)
    }
    return paramObs
  }

  paramObs.attach = attach

  const getWithArgs: (newArgs: Partial<ArgsType>) => Promise<M> = async (
    newArgs
  ) => {
    const clone = buildParamaterizedObs(name, originalArgs, buildObs)
    return await clone.attach(newArgs)
  }

  paramObs.getWithArgs = getWithArgs

  paramObs.withName = (newName) => {
    return buildParamaterizedObs(newName, originalArgs, buildObs)
  }

  const originalObsPipe = originalObs.pipe

  paramObs.pipe = (
    ...operations: OperatorFunction<any, any>[]
  ): ParamaterizedObservable<ArgsType, any, Name> => {
    const piped = originalObsPipe.apply(
      originalObs,
      operations as []
    ) as ParamaterizedObservable<any, M, any>

    return buildParamObsFromObs(
      piped,
      originalArgs,
      buildObs,
      argsSubject,
      name
    )
  }

  // Object.defineProperty(paramObs, "name", {
  //   configurable: false,
  //   writable: false,
  //   value: name,
  // })

  paramObs.originalArgs = originalArgs

  paramObs.getCurrentParams = getCurrentArgMap
  paramObs.obs = () => {
    return originalObs
  }

  paramObs.then = (handler) => {
    return firstValueFrom(originalObs).then(handler)
  }

  paramObs.build = buildObs

  paramObs.observableParams = argsSubject.asObservable()

  return paramObs
}
