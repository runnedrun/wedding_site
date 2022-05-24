import { ProcessorContext, ViewBuilderSpecialArg } from "../processSpecialArgs"

export const getProp = (
  arg: ViewBuilderSpecialArg<any>,
  context: ProcessorContext
) => {
  if (arg._buildValue) {
    return arg._buildValue(arg._value, context)
  }
  return arg._value
}
