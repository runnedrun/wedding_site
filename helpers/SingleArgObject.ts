export type SingleArgObject<NameType extends string, ValueType extends any> = {
  [key in NameType]: ValueType
}

export const buildSingleArgObject = <
  ArgName extends string,
  ArgValue extends any
>(
  argName: ArgName,
  argValue: ArgValue
) => {
  return { [argName]: argValue } as SingleArgObject<ArgName, ArgValue>
}
