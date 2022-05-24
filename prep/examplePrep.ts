import { creators } from "@/data/fb"

export const examplePrep = () => {
  return creators.publicUser({
    nickname: "test1",
  })
}
