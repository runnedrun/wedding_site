import { setters } from "@/data/fb"

export const prepRsvps = async () => {
  await setters.rsvpYes("test-1", {
    email: "test@test.com",
    names: ["David", "John"],
    dietaryRestrictions: "David is allergic to nuts",
  })

  return setters.rsvpYes("test-2", {
    email: "test2@test.com",
    names: ["Lauren"],
  })
}
