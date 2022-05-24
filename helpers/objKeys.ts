export type ExtractStringKeys<T> = Extract<keyof T, string>[]

export const objKeys = Object.keys as <T>(o: T) => (keyof T)[]
export const objStringKeys = Object.keys as <T>(o: T) => ExtractStringKeys<T>
