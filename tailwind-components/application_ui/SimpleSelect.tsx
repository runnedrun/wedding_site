import React from "react"
import { Fragment, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import classNames from "classnames"

interface Option {
  text: string
  id: string
}

interface DropdownProps {
  options: Option[]
  label: string
  onSelect: (option: Option | undefined) => void
  className?: string
  value?: string
  highlight: boolean
}

export const SimpleSelect = ({
  options,
  label,
  onSelect,
  className,
  value,
  highlight,
}: DropdownProps) => {
  const [selected, setSelected] = useState<string | undefined>(value)
  const [clicked, setClicked] = useState<boolean>()

  const selectOption = (text: string) => {
    if (selected === text) {
      onSelect(undefined)
      setSelected(undefined)
    } else {
      const option = options.find((object) => object.text === text)
      onSelect(option)
      setSelected(text)
    }
  }

  return (
    <div className={className}>
      <Listbox value={selected} onChange={selectOption}>
        <Listbox.Label className="block text-sm font-medium text-gray-700">
          {label}
        </Listbox.Label>
        <div className="mt-1 relative" onClick={(_) => setClicked(true)}>
          <Listbox.Button
            className={classNames(
              "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              { "bg-yellow-200": highlight && !clicked }
            )}
          >
            <span className="block truncate">
              {selected || <div>&nbsp;</div>}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-indigo-600" : "text-gray-900",
                      "cursor-default select-none relative py-2 pl-3 pr-9"
                    )
                  }
                  value={option.text}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "block truncate"
                        )}
                      >
                        {option.text}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-indigo-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
