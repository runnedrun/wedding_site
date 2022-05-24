import sgMail from "@sendgrid/mail"
import * as functions from "firebase-functions"

const hyliteEmailAddress = "info@hylitepeople.com"

const sgApiKey = () => functions.config().sendgrid?.key
sgApiKey() && sgMail.setApiKey(sgApiKey())

const bcc =
  process.env.NODE_ENV === "production" ? hyliteEmailAddress : undefined

export enum EmailType {
  testEmail,
}

const groups = {
  [EmailType.testEmail]: 16497,
}

export const sendEmail = (
  email: string,
  templateId: string,
  emailType: EmailType,
  data: any
) => {
  const msg = {
    from: "info@hylitepeople.com",
    personalizations: [
      {
        to: email,
        bcc,
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
