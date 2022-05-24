export const dedupArray = <Type extends string | number | symbol>(
  arr: Type[]
): Type[] => {
  const seen = {} as Record<Type, boolean>
  return arr.filter((item) => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true)
  })
}
