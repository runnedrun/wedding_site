import { Timestamp } from "@firebase/firestore"
import { ForeignKey } from "../baseTypes/ForeignKey"

export type Optional<T> = T | undefined | null

export type ValueTypes = Optional<
  | string
  | Timestamp
  | number
  | string[]
  | number[]
  | boolean
  | Object
  | ForeignKey<any>
>
