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

export const SendEmailOnRsvpCreateEdit = functions.firestore
  .document("rsvpYes/{docId}")
  .onWrite(async (change) => {
    const previous = change.before.data()

    const type = previous ? "edit" : "create"

    const after = change.after
    const current = change.after.data() as RsvpYes
    const otherTimes = current.otherTimes || {}
    const emailData = {
      names: current.names,
      otherTimes: otherTimesOrder.filter(
        (_) => otherTimes[_] || _ === OtherTimes.SaturdayAfternoon
      ),
      dietaryRestrictions: current.dietaryRestrictions || "none",
      notes: current.notes || "none",
      storyAddition: current.storyAddition,
      rsvpId: after.id,
      headerCopy: previous ? "Updated" : "Confirmed",
      firstSentenceCopy: previous
        ? "We now have the following RSVP info for you"
        : "We've confirmed the following RSVP info for you",
    }

    console.log("sending email", current.email, emailData)

    sendEmail(
      current.email,
      "d-2cb222708efb4c97ae07abaf6fbbd50b",
      EmailType.rsvpEmail,
      emailData
    )
  })
