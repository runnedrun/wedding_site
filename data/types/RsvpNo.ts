import { Model } from "../baseTypes/Model"

export type RsvpNo = Model<
  "rsvpNo",
  {
    email: string
    notes: string
  }
>
