import { PublicUser } from "@/data/types/PublicUser"
import { RsvpYes } from "@/data/types/RsvpYes"
import { objKeys } from "@/helpers/objKeys"
import * as functions from "firebase-functions"
import { EmailType, sendEmail } from "../emails_helpers/sendEmail"
import { fbSet } from "../helpers/writers"

export const SendEmailOnRsvpCreate = functions.firestore
  .document("rsvpYes/{docId}")
  .onCreate(async (change) => {
    const data = change.data() as RsvpYes
    const emailData = {
      names: data.names,
      otherTimes: objKeys(data.otherTimes || {}).filter(
        (_) => data.otherTimes[_]
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
