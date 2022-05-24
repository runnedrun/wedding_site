import "../styles/globals.css"
import "../styles/device.css"
import type { AppProps } from "next/app"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import initAuth from "@/data/auth/initAuth" // the module you created above
import { init } from "@/data/initFb"
import LogRocket from "logrocket"
import * as Sentry from "@sentry/browser"
import { setLogRocketSessionUrl } from "@/page_helpers/session_recording/SessionRecorder"
import { SaveSessionButton } from "@/views/app/SaveSessionButton"

init()
initAuth()

const isProd = process.env.NODE_ENV === "production"

// uncomment this to enable Sentry and logrocket error reporting, after configuring both
// only initialize when in the browser
if (typeof window !== "undefined") {
  if (isProd) {
    LogRocket.init("j1wkwd/wedding")
    LogRocket.getSessionURL((sessionURL) => {
      setLogRocketSessionUrl(sessionURL)
      Sentry.configureScope((scope) => {
        scope.setExtra("sessionURL", sessionURL)
      })
    })

    Sentry.init({
      beforeSend(event) {
        const logRocketSession = LogRocket.sessionURL
        if (logRocketSession !== null) {
          event.extra["LogRocket"] = logRocketSession
          return event
        } else {
          return event
        }
      },
    })
  } else {
    setLogRocketSessionUrl(null)
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <SaveSessionButton />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
