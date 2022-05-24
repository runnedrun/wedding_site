export const enumKeys = <T>(e: T) =>
  (Object.keys(e).filter(
    (k) => typeof e[k as any] === "number"
  ) as unknown) as (keyof T)[]
