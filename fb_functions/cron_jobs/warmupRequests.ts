import axios from "axios"
import * as functions from "firebase-functions"
import { isProd } from "../helpers/isProd"

const baseUrl = null // put your endpoint here"

const endpointsToWarm = []

const warmupFlag = "?_warmup=true"

export const warmup = () => {
  return baseUrl
    ? Promise.all(
        endpointsToWarm.map((endpoint) => {
          axios(`${baseUrl}/${endpoint}${warmupFlag}`)
            .then((response) => {
              console.log("warmup successful", endpoint, response.status)
            })
            .catch((error) => {
              console.error(
                `error while warming up ${endpoint}:`,
                error.message
              )
            })
        })
      )
    : Promise.resolve()
}

export const warmupRequests = functions.pubsub
  .schedule("*/5 * * * *")
  .timeZone("America/Chicago")
  .onRun(() => {
    if (!isProd()) {
      console.log("not prod, not warming up")
      return
    }

    return warmup()
  })
