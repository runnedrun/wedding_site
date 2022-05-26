import { hydrateTimestamps } from "@/data/fetchHelpers/jsonifyTimestamps"
import {
  ArgsTypeFromParamObs,
  RecordParamObs,
  ValueTypeFromParamObs,
} from "@/data/paramObsBuilders/ParamObsTypeUtils"
import { PropArg } from "@/data/paramObsBuilders/propSpecialArg"
import { FilterTypeConditionally } from "@/helpers/FilterTypeConditionally"
import { toTitleCase } from "@/helpers/toTitleCase"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { createContext, useContext } from "react"
import {
  getInputsAndValuesFromParamObs,
  InputsAndValuesFromParamObs,
} from "./getInputsAndValuesFromParamObs"

const PrefetchContext = createContext({})

type PossiblePrefetchData<PrefetchType extends Record<string, any>> = {
  prefetch?: PrefetchType
  context: { host: string }
}

type ComponentContext = {
  host: string
}

type RenderFn<ParamObsType extends RecordParamObs> = (
  props: InputsAndValuesFromParamObs<ParamObsType> & {
    _context: ComponentContext
  }
) => React.ReactElement<any, any>

type ComponentInputProps<ParamObsType extends RecordParamObs> = {
  [key in keyof FilterTypeConditionally<
    ArgsTypeFromParamObs<ParamObsType>,
    PropArg<any>
  >]: FilterTypeConditionally<
    ArgsTypeFromParamObs<ParamObsType>,
    PropArg<any>
  >[key] extends PropArg<infer ValueType>
    ? ValueType
    : never
}

type Config<ParamObsType extends RecordParamObs> = {
  name?: string
  hideIfUndefined?: (keyof ValueTypeFromParamObs<ParamObsType>)[]
  hideWhen?: (currentValue: ValueTypeFromParamObs<ParamObsType>) => boolean
  getPrefetchedData?: (
    serverSideData: any,
    props: ComponentInputProps<ParamObsType>
  ) => Partial<ValueTypeFromParamObs<ParamObsType>>
}

const isRender = (
  renderOrConfig: RenderFn<any> | Config<any>
): renderOrConfig is RenderFn<any> => {
  return typeof renderOrConfig === "function"
}

export function component<ParamObsType extends RecordParamObs>(
  dataParamObsFn: () => ParamObsType,
  ChildComponent: RenderFn<ParamObsType>
)

export function component<ParamObsType extends RecordParamObs>(
  dataParamObsFn: () => ParamObsType,
  config: Config<ParamObsType>,
  ChildComponent: RenderFn<ParamObsType>
)

export function component<ParamObsType extends RecordParamObs>(
  dataParamObsFn: () => ParamObsType,
  renderOrChildComponent: RenderFn<ParamObsType> | Config<ParamObsType>,
  optChildComponent?: RenderFn<ParamObsType>
) {
  const ChildComponent = isRender(renderOrChildComponent)
    ? renderOrChildComponent
    : optChildComponent
  const config = isRender(renderOrChildComponent) ? {} : renderOrChildComponent

  const shouldHide = (props: ValueTypeFromParamObs<ParamObsType>) => {
    const hideWhenIsTrue = config.hideWhen && config.hideWhen(props)

    const shouldHideBasedOnUndefinedValues = (
      config.hideIfUndefined || []
    ).some((key) => {
      return typeof props[key] === "undefined"
    })

    return hideWhenIsTrue || shouldHideBasedOnUndefinedValues
  }

  const Component = (
    props: PossiblePrefetchData<ValueTypeFromParamObs<ParamObsType>> &
      ComponentInputProps<ParamObsType>
  ) => {
    const query = useRouter().query

    const dataParamObs = useMemo(dataParamObsFn, [])

    if (props.prefetch) {
      const ssrData = config.getPrefetchedData
        ? config.getPrefetchedData(props.prefetch, props)
        : {}

      const parentInputsAndValues = getInputsAndValuesFromParamObs(
        dataParamObs,
        { props, query },
        { ...hydrateTimestamps(props.prefetch), ...ssrData }
      )

      const componentContext = { host: props.context.host }

      return (
        <PrefetchContext.Provider value={props.prefetch}>
          {shouldHide(
            parentInputsAndValues as ValueTypeFromParamObs<ParamObsType>
          ) ? (
            <span></span>
          ) : (
            <ChildComponent
              {...parentInputsAndValues}
              {...props}
              _context={componentContext}
            ></ChildComponent>
          )}
        </PrefetchContext.Provider>
      )
    } else {
      const prefetchData = hydrateTimestamps(
        useContext(PrefetchContext) || {}
      ) as any

      const ssrData = config.getPrefetchedData
        ? config.getPrefetchedData(prefetchData, props)
        : {}

      const parentInputsAndValues = getInputsAndValuesFromParamObs(
        dataParamObs,
        { props, query },
        { ...prefetchData, ...ssrData }
      )

      const componentContext = {
        host: typeof window === "undefined" ? null : window.location.hostname,
      }

      return shouldHide(
        parentInputsAndValues as ValueTypeFromParamObs<ParamObsType>
      ) ? (
        <span></span>
      ) : (
        <ChildComponent
          {...parentInputsAndValues}
          {...props}
          _context={componentContext}
        />
      )
    }
  }
  Component.displayName = config.name || ""

  return Component
}
