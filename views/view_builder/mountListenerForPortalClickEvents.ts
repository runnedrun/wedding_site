import React from "react"
import { logClickEvent } from "./logClickEvent"

const portalName = "headlessui-portal-root"
export const mountListenerForPortalClickEvents = (el: HTMLElement) => {
  console.log("adding event listner")
  el.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    const portalParent = target.closest(`#${portalName}`)
    console.log("click", target, portalParent)
    if (portalParent) {
      logClickEvent((event as unknown) as React.MouseEvent, {})
    }
  })
}
