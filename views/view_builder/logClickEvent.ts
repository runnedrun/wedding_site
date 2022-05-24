import { logEvent } from "@/analytics/logEvent"
import React from "react"
import { getClickedElementNames } from "./getClickedElementName"

export const logClickEvent = (
  e: React.MouseEvent,
  context: object,
  componentName?: string
) => {
  const analyticsNames = getClickedElementNames(e).join(".")
  const analyticsNamePostfix = analyticsNames ? `.${analyticsNames}` : ""

  const componentNamePrefix = componentName ? `${componentName}.` : ""

  logEvent(`${componentNamePrefix}c${analyticsNamePostfix}`, context)
}
