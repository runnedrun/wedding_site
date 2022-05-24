import React from "react"
import { useState } from "react"

interface Options {
  name: string
  badgeCount: number
}

export interface TabsWithUnderlineBadgesProps {
  options: Options[]
}

export const exampleProps: TabsWithUnderlineBadgesProps = {
  options: [
    {
      name: "Applied",
      badgeCount: 52,
    },
    {
      name: "Phone Screening",
      badgeCount: 6,
    },
    {
      name: "Interview",
      badgeCount: 4,
    },
    {
      name: "Offer",
      badgeCount: NaN,
    },
    {
      name: "Disqualified",
      badgeCount: NaN,
    },
  ],
}

export const TabsWithUnderlineBadges = ({
  options,
}: TabsWithUnderlineBadgesProps) => {
  const [selectedItem, setSelectedItem] = useState(options[0].name)
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedItem}
        >
          {options.map((opt) => {
            return (
              <option selected={opt.name === selectedItem}>{opt.name}</option>
            )
          })}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {options.map((opt) => {
              return (
                <a
                  href="#"
                  onClick={() => {
                    setSelectedItem(opt.name)
                  }}
                  className={
                    opt.name === selectedItem
                      ? "border-indigo-500 text-indigo-600 whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm"
                  }
                  aria-current={opt.name === selectedItem ? "page" : undefined}
                >
                  {opt.name}
                  {!isNaN(opt.badgeCount) && (
                    <span
                      className={
                        opt.name === selectedItem
                          ? "bg-indigo-100 text-indigo-600 hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                          : "bg-gray-100 text-gray-900 hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                      }
                    >
                      {opt.badgeCount}
                    </span>
                  )}
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default TabsWithUnderlineBadges
