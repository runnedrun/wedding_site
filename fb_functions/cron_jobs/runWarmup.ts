import "../fixTsPaths"
import { warmup } from "./warmupRequests"

console.log("running RIGHT NOW")

warmup().then(() => {
  console.log("warmup done")
})
