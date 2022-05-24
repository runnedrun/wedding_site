import {
  ArgsTypeFromParamObs,
  RecordParamObs,
  ValueTypeFromParamObs,
} from "@/data/paramObsBuilders/ParamObsTypeUtils"
import { ReadOnlyArg } from "@/data/paramObsBuilders/readonlySpecialArg"
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter"
import { OmitKeysConditionally } from "@/helpers/FilterTypeConditionally"
import { objKeys } from "@/helpers/objKeys"
import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { UnionToIntersection } from "utility-types"
import {
  ProcessorContext,
  processSpecialArgs,
  processSpecialArgsAndExtractValues,
  updateArgMapWithSpecialProcessing,
  ValueTypeFromSpecialArg,
  ViewBuilderSpecialArg,
} from "./processSpecialArgs"
import useDeepCompareEffect from "use-deep-compare-effect"

type FilterReadonlyKeys<Source> = OmitKeysConditionally<
  Source,
  ReadOnlyArg<any>
>

type ValueTypeFromArgOrSpecialArg<
  ArgType extends any
> = ArgType extends ViewBuilderSpecialArg<any>
  ? ValueTypeFromSpecialArg<ArgType>
  : ArgType

type SetKey<KeyName extends string> = `set${Capitalize<KeyName>}`

type SetFunction<
  ParamObsType extends RecordParamObs,
  Key extends keyof ArgsTypeFromParamObs<ParamObsType>
> = (
  value: ValueTypeFromArgOrSpecialArg<ArgsTypeFromParamObs<ParamObsType>[Key]>
) => void

type SettersFromParamObs<ParamObsType extends RecordParamObs> = {
  [key in keyof FilterReadonlyKeys<
    UnionToIntersection<ArgsTypeFromParamObs<ParamObsType>>
  > &
    string as SetKey<key>]: SetFunction<ParamObsType, key>
}

export type SettersAndValuesFromParamObs<
  ParamObsType extends RecordParamObs
> = SettersFromParamObs<ParamObsType> &
  {
    [key in keyof UnionToIntersection<
      ArgsTypeFromParamObs<ParamObsType>
    >]: ValueTypeFromArgOrSpecialArg<ArgsTypeFromParamObs<ParamObsType>[key]>
  }

export type InputsAndValuesFromParamObs<ParamObsType extends RecordParamObs> = {
  [key in keyof ValueTypeFromParamObs<ParamObsType>]: ValueTypeFromParamObs<ParamObsType>[key]
} &
  SettersAndValuesFromParamObs<ParamObsType>

const isReadOnly = (value) => value?._readonly

export const getInputs = <ParamObsType extends RecordParamObs>(
  paramObs: ParamObsType,
  context: ProcessorContext
): SettersAndValuesFromParamObs<ParamObsType> => {
  const settableKeysOnly = objKeys(paramObs.originalArgs).filter((key) => {
    const initialValue = paramObs.originalArgs[key]
    return !isReadOnly(initialValue)
  }) as Extract<
    keyof FilterReadonlyKeys<
      UnionToIntersection<ArgsTypeFromParamObs<ParamObsType>>
    >,
    string
  >[]

  const [argsState, setArgsState] = useState(
    processSpecialArgsAndExtractValues(paramObs.originalArgs, {
      ...context,
      // triggeredByContextUpdate: true,
    })
  )

  useDeepCompareEffect(() => {
    const update = processSpecialArgs(paramObs.getCurrentParams(), {
      query: { ...context.query },
      props: { ...context.props },
      triggeredByContextUpdate: true,
    })

    paramObs.attach(update)
  }, [context.query, context.props])

  useEffect(() => {
    const sub = paramObs.observableParams.subscribe((args) => {
      const processedArgs = processSpecialArgsAndExtractValues(args, context)
      if (!isEqual(processedArgs, argsState)) {
        setArgsState(processedArgs)
      }
    })
    return sub.unsubscribe.bind(sub)
  }, [])

  const stateValuesAndSetters = {
    ...argsState,
  } as SettersAndValuesFromParamObs<ParamObsType>

  settableKeysOnly.forEach((key) => {
    const setKey = `set${capitalizeFirstLetter(key)}` as SetKey<typeof key>
    const setFunc = ((value) => {
      return paramObs.attach(
        updateArgMapWithSpecialProcessing(
          paramObs.getCurrentParams(),
          key,
          value
        )
      )
    }) as any

    stateValuesAndSetters[setKey] = setFunc
  })

  return stateValuesAndSetters
}

const getData = <ParamObsType extends RecordParamObs>(
  paramObs: ParamObsType,
  defaults?: ValueTypeFromParamObs<ParamObsType>
): ValueTypeFromParamObs<ParamObsType> => {
  const [valueState, setValueState] = useState(defaults)
  useEffect(() => {
    const sub = paramObs.subscribe((value) => {
      if (!isEqual(value, valueState)) {
        setValueState(value as ValueTypeFromParamObs<ParamObsType>)
      }
    })
    return sub.unsubscribe.bind(sub)
  }, [])

  return valueState
}

export const getInputsAndValuesFromParamObs = <
  ParamObsType extends RecordParamObs
>(
  paramObs: ParamObsType,
  context: ProcessorContext,
  defaults?: ValueTypeFromParamObs<ParamObsType>
): InputsAndValuesFromParamObs<ParamObsType> => {
  return {
    ...getInputs(paramObs, context),
    ...getData(paramObs, defaults),
  } as InputsAndValuesFromParamObs<ParamObsType>
}

// const obs = {} as ParamaterizedObservable<{input1: string, omitMe: {_readonly:true}}, { value1: number }, "test">

// const u = getInputsAndValuesFromParamObs(obs)
