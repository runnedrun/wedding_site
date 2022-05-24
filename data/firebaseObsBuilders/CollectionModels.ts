import { buildConverterForType } from "../builders/buildConverterForType"
import { FirestoreDataConverter } from "@firebase/firestore"

import { PrivateUser } from "../types/PrivateUser"
import { PublicUser } from "../types/PublicUser"
import { User } from "../types/User"
import { SessionRecord } from "../types/SessionRecord"
import { RsvpYes } from "../types/RsvpYes"
import { RsvpNo } from "../types/RsvpNo"

export const CollectionsWithConverters: {
  [key in keyof CollectionModels]: FirestoreDataConverter<CollectionModels[key]>
} = {
  privateUser: buildConverterForType<PrivateUser>(),
  publicUser: buildConverterForType<PublicUser>(),
  rsvpYes: buildConverterForType<RsvpYes>(),
  rsvpNo: buildConverterForType<RsvpNo>(),
  dev_SessionRecord: buildConverterForType<SessionRecord>(),
}

export type AllModels = {
  privateUser: PrivateUser
  publicUser: PublicUser
  user: User
  rsvpYes: RsvpYes
  rsvpNo: RsvpNo
  dev_SessionRecord: SessionRecord
}

export type CollectionModels = Omit<AllModels, "user">
