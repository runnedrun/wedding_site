import { PublicUser } from "@/data/types/PublicUser"
import { RsvpNo } from "@/data/types/RsvpNo"
import { RsvpYes } from "@/data/types/RsvpYes"
import { objKeys } from "@/helpers/objKeys"
import * as functions from "firebase-functions"
import { EmailType, sendEmail } from "../emails_helpers/sendEmail"
import { fbSet } from "../helpers/writers"

export const SendEmailOnRegretCreate = functions.firestore
  .document("rsvpNo/{docId}")
  .onCreate(async (change) => {
    const data = change.data() as RsvpNo
    const emailData = {
      name: data.name,
      notes: data.notes || "none",
    }

    console.log("sending email", data.email, emailData)

    sendEmail(
      data.email,
      "d-5240d22245bc414b9fa9836cded8de00",
      EmailType.rsvpEmail,
      emailData
    )
  })
