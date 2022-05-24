import { Model } from "../baseTypes/Model"

export type RsvpYes = Model<
  "rsvpYes",
  {
    names: string[]
    dietaryRestrictions?: string
    email: string
  }
>
