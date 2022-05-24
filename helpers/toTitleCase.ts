export const toTitleCase = <T extends string>(str: T): Capitalize<T> => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  }) as Capitalize<T>
}
