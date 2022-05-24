import {
  ProcessorContext,
  ViewBuilderSpecialArg,
} from "@/views/view_builder/processSpecialArgs"

export type WritableArg<ValueType> = Omit<
  ViewBuilderSpecialArg<ValueType>,
  "_readonly"
>

export const writableSpecialArg = <ValueType extends any>(
  value: ValueType,
  buildValue?: (currentValue: ValueType, context: ProcessorContext) => ValueType
): WritableArg<ValueType> => ({
  _value: value,
  _buildValue: buildValue,
  _isGenerated: true,
  _skipArg: true,
})
