import { Model } from "../baseTypes/Model"

export type PrivateUser = Model<
  "privateUser",
  {
    // put private info here, such as email, phone, etc
    name: string
    emailAddress: string
  }
>
