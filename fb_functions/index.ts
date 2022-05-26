import "./fixTsPaths"
import * as firebase from "firebase-admin/app"
import { SendEmailOnRsvpCreate } from "./triggers/SendEmailOnRsvpCreate"

firebase.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export { SendEmailOnRsvpCreate }
