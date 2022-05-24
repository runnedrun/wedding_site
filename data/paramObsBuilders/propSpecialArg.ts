import {
  ProcessorContext,
  ViewBuilderSpecialArg,
} from "@/views/view_builder/processSpecialArgs"

export type PropArg<
  ValueType extends any
> = ViewBuilderSpecialArg<ValueType> & {
  _readonly: true
  _buildValue: (arg: ValueType, context: ProcessorContext) => ValueType
  _value: ValueType
  _readFromProp: true
}

export const propSpecialArg = <ValueType extends any, PropName extends string>(
  propName: PropName,
  defaultValue: ValueType
): PropArg<ValueType> => {
  const getProps = (lastValue: ValueType, context: ProcessorContext) => {
    const currentValue = context.props[propName] as ValueType
    return typeof currentValue === "undefined" ? defaultValue : currentValue
  }
  return {
    _readonly: true,
    _value: defaultValue,
    _buildValue: getProps,
    _readFromProp: true,
  } as PropArg<ValueType>
}
