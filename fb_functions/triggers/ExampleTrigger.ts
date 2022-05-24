import { PublicUser } from "@/data/types/PublicUser"
import * as functions from "firebase-functions"
import { fbSet } from "../helpers/writers"

export const ExampleTrigger = functions.firestore
  .document("publicUser/{docId}")
  .onCreate(async (change) => {
    const data = change.data() as PublicUser
    fbSet("publicUser", data.uid, { nickname: "generated nickname" })
  })
