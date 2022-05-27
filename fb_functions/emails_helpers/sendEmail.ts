import sgMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

const senderEmailAddress = "wedding@xinqing-david.com"
const ccEmailAddresses = [
  "xinqing.lu.joanne+wedding@gmail.com",
  "runnedrun+wedding@gmail.com",
]

const envName = () => functions.config().other?.env

const sgApiKey = () => functions.config().sendgrid?.key
sgApiKey() && sgMail.setApiKey(sgApiKey())

const bcc =
  process.env.NODE_ENV === "production" ? senderEmailAddress : undefined

export enum EmailType {
  rsvpEmail,
}

const groups = {
  [EmailType.rsvpEmail]: 19375,
}

export const sendEmail = (
  email: string,
  templateId: string,
  emailType: EmailType,
  data: any
) => {
  const emailPrefix = envName() === "production" ? "" : "staging-"
  const emailToSendFrom = `${emailPrefix}${senderEmailAddress}`
  const cc = ccEmailAddresses.map((_) => ({ email: _ }))
  const msg = {
    from: emailToSendFrom,
    personalizations: [
      {
        to: email,
        cc,
        dynamicTemplateData: data,
        asm: {
          group_id: groups[emailType],
          groups_to_display: [groups[emailType]],
        },
      },
    ],
    templateId,
  } as sgMail.MailDataRequired
  console.log("sending email", JSON.stringify(msg, null, 2))
  if (sgApiKey()) {
    return sgMail.send(msg).then(
      (r) => {
        console.log("Email sent")
      },
      (error) => {
        console.error("email error", JSON.stringify(error))
      }
    )
  } else {
    console.log("no SG api key, skipping")
    return Promise.resolve()
  }
}
