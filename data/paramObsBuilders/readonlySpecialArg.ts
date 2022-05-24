import { isServerside } from "@/helpers/isServerside"
import {
  ProcessorContext,
  ViewBuilderSpecialArg,
} from "@/views/view_builder/processSpecialArgs"

export type ReadOnlyArg<ValueType> = ViewBuilderSpecialArg<ValueType> & {
  _readonly: true
}

export const readonlySpecialArg = <ValueType extends any>(
  value: ValueType,
  buildValue?: (currentValue: ValueType, context: ProcessorContext) => ValueType
): ReadOnlyArg<ValueType> => ({
  _readonly: true,
  _value: value,
  _buildValue: buildValue,
  _isGenerated: true,
  _skipArg: isServerside(),
})
