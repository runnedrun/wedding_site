import { getAuth as fbGetAuth } from "@firebase/auth"
import { init } from "./initFb"
export const getAuth = () => {
  init()
  return fbGetAuth()
}
