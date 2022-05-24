import { isDemoMode } from "@/helpers/isDemoMode"
import {
  logEvent as fbLogEvent,
  getAnalytics,
  setCurrentScreen as fbSetCurrentScreen,
} from "@firebase/analytics"

let currentScreen = null
let logContext = {}

const pathMap = (source: object, key: string) => {
  const pathMap = {}

  const visit = (source: object, key: string) => {
    Object.keys(source).forEach((k) => {
      const item = source[k]
      const path = key ? `${key}_${k}` : k

      item && typeof item == "object" ? visit(item, k) : (pathMap[path] = item)
    })
  }

  visit(source, key)

  return pathMap
}

export const logEvent = (name: string, extraData?: any) => {
  if (typeof window !== "undefined") {
    const allExtraData = {
      ...(extraData || {}),
      ...logContext,
    }
    const extraDataPathMap = extraData ? pathMap(allExtraData, null) : {}
    const namespacedName = currentScreen ? `${currentScreen}.${name}` : name
    if (isDemoMode()) {
      console.debug("ANALYTICS LOG:", namespacedName, extraDataPathMap)
    } else {
      const analytics = getAnalytics()
      fbLogEvent(analytics, namespacedName, extraDataPathMap)
    }
  }
}

export const setLogContext = (setTo: object) => {
  logContext = setTo
}

export const setCurrentScreen = (name: string) => {
  if (typeof window !== "undefined") {
    currentScreen = name
    if (isDemoMode()) {
      console.debug("SETTING SCREEN:", name)
    } else {
      const analytics = getAnalytics()
      fbSetCurrentScreen(analytics, name)
    }
  }
}
