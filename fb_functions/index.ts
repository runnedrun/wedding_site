import "./fixTsPaths"
import * as firebase from "firebase-admin/app"
import { SendEmailOnRsvpCreateEdit } from "./triggers/SendEmailOnRsvpCreateAndEdit"
import { SendEmailOnRegretCreate } from "./triggers/SendEmailOnRegretCreate"

firebase.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export { SendEmailOnRsvpCreateEdit, SendEmailOnRegretCreate }
