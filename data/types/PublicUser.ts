import { Model } from "../baseTypes/Model"

export type PublicUser = Model<
  "publicUser",
  {
    // put info here that you want to be publicly accessible, like nickname, etc
    nickname: string
  }
>

export const PublicUserKeys: (keyof PublicUser)[] = ["nickname"]
