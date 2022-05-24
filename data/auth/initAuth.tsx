import { init, InitConfig } from "next-firebase-auth"
import { redirectWithDestination } from "@/helpers/redirectWithDestination"
import { redirectToQueryDestination } from "@/helpers/redirectToQueryDestination"
import { init as initFb } from "@/data/initFb"
import { isDemoMode } from "@/helpers/isDemoMode"

const initAuth = () => {
  initFb()

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY).privateKey
    : undefined

  const config = {
    authPageURL: redirectWithDestination("/sign_in"),
    appPageURL: redirectToQueryDestination,
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    // Required in most cases.
    firebaseClientInitConfig: {
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
    },
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must not be accesssible on the client side.
        privateKey: privateKey,
      },
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    },
    cookies: {
      name: "hylite", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: !isDemoMode(), // set this to false in local (non-HTTPS) development
      signed: true,
    },
  } as InitConfig

  if (isDemoMode()) {
    config.firebaseAuthEmulatorHost = "localhost:9099"
  }

  init(config)
}

export default initAuth
