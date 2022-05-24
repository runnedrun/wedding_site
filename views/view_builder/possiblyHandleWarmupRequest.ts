import { init } from "@/data/initFb"
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore"

const unsubscribes: Unsubscribe[] = []

export const possiblyHandleWarmupRequest = (query: any) => {
  if (query._warmup) {
    console.log(`warming up. ${unsubscribes.length} existing listeners`)
    unsubscribes.forEach((unsubscribe) => unsubscribe())
    unsubscribes.splice(0, unsubscribes.length)

    const firestore = init()
    return new Promise<boolean>((resolve) => {
      const unsub = onSnapshot(
        doc(firestore, "warmup/warmup"),
        () => {
          resolve(true)
          console.log("warmup connection made")
        },
        () => {
          resolve(true)
        }
      )
      unsubscribes.push(unsub)
    })
  }

  return Promise.resolve(false)
}
