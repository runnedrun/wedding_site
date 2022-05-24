import "./fixTsPaths"
import * as firebase from "firebase-admin/app"
import * as functions from "firebase-functions"
const arg = require("arg")

import { getFirestore, Timestamp } from "firebase-admin/firestore"
import { credential } from "firebase-admin"
import { SessionRecord } from "@/data/types/SessionRecord"
import { objKeys } from "@/helpers/objKeys"
import puppeteer from "puppeteer"
import { deepMapObj } from "@/helpers/deepMapObj"

const metaConfig = functions.config().metadb?.credentials

let originalEmulatorHost
const initMetaDb = () => {
  originalEmulatorHost = process.env["FIRESTORE_EMULATOR_HOST"]
  delete process.env["FIRESTORE_EMULATOR_HOST"]
  const app = firebase.initializeApp(
    { credential: credential.cert(metaConfig) },
    "metadb"
  )
  return app
}

const initMainDb = () => {
  process.env["FIRESTORE_EMULATOR_HOST"] =
    process.env["FIRESTORE_EMULATOR_HOST"] || originalEmulatorHost
  return firebase.initializeApp()
}

export const hydrateTimestamps = (obj: any) => {
  return deepMapObj(obj || {}, (value) => {
    if (value?.__convertToDate) {
      return Timestamp.fromMillis(value.value)
    }
  })
}

const openPage = async (sessionData: SessionRecord) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setViewport(sessionData.viewport)
  console.log("opening: ", sessionData.path)
  await page.goto(
    `http://localhost:3000/${
      sessionData.path
    }?sessionReplayData=${encodeURIComponent(sessionData.stateAndProps)}`
  )
}

const writeSessionData = async (sessionData: SessionRecord) => {
  const data = hydrateTimestamps(JSON.parse(sessionData.data))

  const normalApp = initMainDb()
  if (!normalApp.options.projectId.includes("demo")) {
    console.log("cannot load a session unless loading into the emulator")
  }

  const firestore = getFirestore(normalApp)
  let writeBatch = firestore.batch()
  let writeCount = 0
  const collectionNames = objKeys(data)

  for (let i = 0; i < collectionNames.length; i++) {
    const collectionName = collectionNames[i] as string
    const docs = data[collectionName] || {}
    const docIds = objKeys(docs)
    const collectionReference = firestore.collection(collectionName)
    for (let j = 0; j < docIds.length; j++) {
      const docId = docIds[j] as string
      const docData = docs[docId]
      const doc = collectionReference.doc(docId)
      writeBatch.set(doc, docData)
      writeCount++
      if (writeCount % 400 === 0) {
        await writeBatch.commit()
        writeBatch = firestore.batch()
      }
    }
  }

  await writeBatch.commit()

  console.log("completed mirroring of data", writeCount)
}

const getSessionRecord = async (sessionId: string) => {
  const metaApp = initMetaDb()

  const sessionRecordDoc = await getFirestore(metaApp)
    .collection("dev_SessionRecord")
    .doc(sessionId)
    .get()

  return sessionRecordDoc.data() as SessionRecord
}

const run = async () => {
  if (!metaConfig) {
    console.log("no metadb config available, not running")
    return
  }

  const args = arg({})

  const sessionid = args._[0] as string

  console.log("sessionId", sessionid)

  if (!sessionid) {
    console.error("MUST PROVIDE A SESSION ID")
    return
  }

  const sessionRecord = await getSessionRecord(sessionid)

  await writeSessionData(sessionRecord)
  openPage(sessionRecord)
}

run()
