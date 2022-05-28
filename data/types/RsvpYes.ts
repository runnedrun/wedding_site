import { Model } from "../baseTypes/Model"

export enum OtherTimes {
  FridayEvening = "8/5 Friday | 9PM | Casual drinks and hang",
  SaturdayAfternoon = "8/6 Saturday | 3PM - 7PM | Big Party!",
  SundayMorning = "8/7 Sunday | 11AM - 1PM | Brunch",
  SundayAfernoon = "8/7 Sunday | Afternoon | TBD",
  MondayMorning = "8/8 Monday | Morning | TBD",
  MondayAfternoon = "8/9 Monday | Afternoon | TBD",
  MondayEvening = "8/9  Monday | Evening | TBD",
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
