import { Timestamp } from "firebase/firestore"
import { CollectionModels } from "../firebaseObsBuilders/CollectionModels"
import { ValueTypes } from "../types/ValueTypes"
import { ForeignKey } from "./ForeignKey"

export type ModelBaseFields = keyof Model<any, {}>
export const BaseFields: ModelBaseFields[] = [
  "uid",
  "archived",
  "archivedOn",
  "createdAt",
  "updatedAt",
]

export type Model<
  CollectionName extends keyof CollectionModels,
  Type extends { [key: string]: ValueTypes }
> = Type & {
  uid: ForeignKey<CollectionName>
  archived?: boolean
  archivedOn?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
