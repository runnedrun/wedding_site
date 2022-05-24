import ancestors from "ancestors"
import React from "react"

const attributeName = "analyticsName"
export const getClickedElementNames = (event: React.MouseEvent): string[] => {
  const target = event.target as HTMLElement
  const nameOfClickedElement = target.dataset[attributeName]

  const allAncestors = ancestors(target) || []
  const ancestorNames = allAncestors
    .reverse()
    .map((ancestor) => ancestor.dataset[attributeName])
    .filter(Boolean)

  nameOfClickedElement && ancestorNames.push(nameOfClickedElement)

  return ancestorNames
}
