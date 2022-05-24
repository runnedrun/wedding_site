import { Model } from "../baseTypes/Model"
import { PrivateUser } from "./PrivateUser"
import { PublicUser } from "./PublicUser"

export type User = Model<"privateUser" | "publicUser", PrivateUser & PublicUser>
