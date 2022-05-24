import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore"
import { getApp as fbGetApp } from "firebase/app"
import { initializeApp } from "firebase/app"
import { connectStorageEmulator, getStorage } from "@firebase/storage"

const getApp = (name?: string) => {
  let app = null
  try {
    app = fbGetApp(name)
  } catch (e) {}
  return app
}

export const initMetaFb = () => {
  const metaApp = getApp("meta")

  if (metaApp) return getFirestore(metaApp)

  const metaFirebaseConfig = {
    apiKey: "AIzaSyDHDGyL3Cr8-VtfZ8_2qZPtLGsqL79dSEQ",
    authDomain: "personal-project-meta.firebaseapp.com",
    projectId: "personal-project-meta",
    storageBucket: "personal-project-meta.appspot.com",
    messagingSenderId: "1047972044949",
    appId: "1:1047972044949:web:3b17f09550eb85533abb9c",
  }

  const app = initializeApp(metaFirebaseConfig, "meta")

  return getFirestore(app)
}

export const init = () => {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE

  if (getApp()) return getFirestore()

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_APP_ID,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_MEASUREMENT_ID,
  }

  const app = initializeApp(config)

  const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  })

  const storage = getStorage()
  demoMode && connectFirestoreEmulator(db, "localhost", 8081)
  demoMode && connectStorageEmulator(storage, "localhost", 9198)
  return db
}
