import { Model } from "../baseTypes/Model"

export type RsvpNo = Model<
  "rsvpNo",
  {
    name: string
    email: string
    notes: string
  }
>
