export const capitalizeFirstLetter = <Input extends string>(
  string: Input
): `${Capitalize<Input>}` => {
  return (string.charAt(0).toUpperCase() +
    string.slice(1)) as `${Capitalize<Input>}`
}
