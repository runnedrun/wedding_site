import { setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"

export const prepRsvps = async () => {
  await setters.rsvpYes("test-1", {
    email: "test@test.com",
    names: ["David", "John"],
    dietaryRestrictions: "David is allergic to nuts",
    createdAt: Timestamp.fromMillis(Date.now() - 5000),
  })

  return setters.rsvpYes("test-2", {
    email: "test2@test.com",
    names: ["Lauren"],
    createdAt: Timestamp.fromMillis(Date.now()),
  })
}
