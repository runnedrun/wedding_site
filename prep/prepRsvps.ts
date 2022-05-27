import { setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"

export const prepRsvps = async () => {
  await setters.rsvpYes("test-1", {
    email: "runnedrun@gmail.com",
    names: ["David", "John"],
    dietaryRestrictions: "David is allergic to nuts",
    createdAt: Timestamp.fromMillis(Date.now() - 5000),
  })

  return setters.rsvpNo("test-2", {
    email: "runnedrun@gmail.com",
    name: "Lauren",
  })
}
