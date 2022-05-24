import "./fixTsPaths"
import * as firebase from "firebase-admin/app"
import { ExampleTrigger } from "./triggers/ExampleTrigger"

firebase.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export { ExampleTrigger }
