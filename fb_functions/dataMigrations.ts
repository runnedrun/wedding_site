import "./fixTsPaths"
import * as firebase from "firebase-admin/app"
const firestore = require("@google-cloud/firestore")
const arg = require("arg")

import { exampleMigration } from "./data_migration/exampleMigration"

firebase.initializeApp()

const getProjectId = async () => {
  const client = new firestore.v1.FirestoreAdminClient()
  const projectId = await client.getProjectId()

  return projectId
}

const run = async () => {
  const projectId = await getProjectId()

  console.log("running migration for projectId: ", projectId)

  const args = arg({
    "--dry": Boolean,
    "--probe": Boolean,
  })
  // run your migration script here
  exampleMigration(args)
}

run()
