import { CountdownType } from "./countdownType"

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], CountdownType[D]>>
        : never
    }[keyof T]
  : ""

type Idx<T, K> = K extends keyof T
  ? T[K]
  : number extends keyof T
  ? K extends `${number}`
    ? T[number]
    : never
  : never

export type PathValue<
  T,
  P extends Paths<T, 2>
> = P extends `${infer Key}.${infer Rest}`
  ? Rest extends Paths<Idx<T, Key>, 2>
    ? PathValue<Idx<T, Key>, Rest>
    : never
  : Idx<T, P>

// type P = {
//   y: 1
//   o: {
//     w: {
//       h: "asdf"
//     }
//   }
// }

// type i = Paths<P>
// type q = PathValue<P, "o.w">
