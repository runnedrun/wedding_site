import { logEvent, setCurrentScreen, setLogContext } from "@/analytics/logEvent"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useScreenLogging = (initialState: object, name: string) => {
  const router = useRouter()
  useEffect(() => {
    const logScreen = () => {
      const analyticsContext = {
        initialState,
        path: router.pathname,
      }

      setLogContext(analyticsContext)

      setCurrentScreen(name)

      logEvent("screen_view")
    }

    router.events.on("routeChangeComplete", logScreen)
    logScreen()

    return () => {
      router.events.off("routeChangeComplete", logScreen)
    }
  }, [])
}
