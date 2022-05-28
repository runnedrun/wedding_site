import { PublicUser } from "@/data/types/PublicUser"
import { OtherTimes, RsvpYes } from "@/data/types/RsvpYes"
import { objKeys } from "@/helpers/objKeys"
import * as functions from "firebase-functions"
import { EmailType, sendEmail } from "../emails_helpers/sendEmail"
import { fbSet } from "../helpers/writers"

const otherTimesOrder = [
  OtherTimes.FridayEvening,
  OtherTimes.SaturdayAfternoon,
  OtherTimes.SundayMorning,
  OtherTimes.SundayAfernoon,
  OtherTimes.MondayMorning,
  OtherTimes.MondayAfternoon,
  OtherTimes.MondayEvening,
]

export const SendEmailOnRsvpCreate = functions.firestore
  .document("rsvpYes/{docId}")
  .onCreate(async (change) => {
    const data = change.data() as RsvpYes
    const otherTimes = data.otherTimes || {}
    const emailData = {
      names: data.names,
      otherTimes: otherTimesOrder.filter(
        (_) => otherTimes[_] || _ === OtherTimes.SaturdayAfternoon
      ),
      dietaryRestrictions: data.dietaryRestrictions || "none",
      notes: data.notes || "none",
      storyAddition: data.storyAddition,
      rsvpId: change.id,
    }

    console.log("sending email", data.email, emailData)

    sendEmail(
      data.email,
      "d-2cb222708efb4c97ae07abaf6fbbd50b",
      EmailType.rsvpEmail,
      emailData
    )
  })
