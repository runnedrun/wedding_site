import { Timestamp } from "firebase/firestore"
import { Model } from "../baseTypes/Model"

export enum OtherTimes {
  FridayEvening = "Friday Night",
  SundayMorning = "Sunday Morning",
  SundayAfernoon = "Sunday Afternoon",
  MondayMorning = "Monday Morning",
  MondayAfternoon = "Monday Afternoon",
  MondayEvening = "Monday Evening",
}

export type RsvpYes = Model<
  "rsvpYes",
  {
    names: string[]
    dietaryRestrictions?: string
    email: string
    storyAddition: string
    notes?: string
    otherTimes: {
      [OtherTimes.FridayEvening]?: boolean
      [OtherTimes.SundayMorning]?: boolean
      [OtherTimes.SundayAfernoon]?: boolean
      [OtherTimes.MondayMorning]?: boolean
      [OtherTimes.MondayAfternoon]?: boolean
      [OtherTimes.MondayEvening]?: boolean
    }
  }
>
