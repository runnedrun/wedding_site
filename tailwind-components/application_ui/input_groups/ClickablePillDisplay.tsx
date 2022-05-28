import { objKeys } from "@/helpers/objKeys"
import { Item } from "@/tailwind-components/application_ui/TypeaheadDropdown"
import { PlusIcon, XIcon } from "@heroicons/react/solid"
import classNames from "classnames"
import { useEffect, useState } from "react"
import { Key } from "ts-keycode-enum"

interface PropsTypes {
  items: Record<string, Item> | Array<Item>
  onChange: (newItems: Record<string, Item>) => void
  validate?: (newItem: string) => Boolean
  placeholder?: string
}

export const ClickablePillDisplay = ({
  items,
  onChange,
  placeholder,
  validate,
}: PropsTypes) => {
  const [itemsState, setItemsState] = useState(items as Record<string, Item>)
  const [invalidItem, setInvalidItem] = useState(false)

  const itemsLength = objKeys(itemsState).length
  const lastItem = itemsState[itemsLength - 1]
  const latestItemText = lastItem?.text

  const callOnChange = (newState) => {
    const keysForValidItems = objKeys(newState).filter((_) => newState[_].text)
    const newObj = {}
    keysForValidItems.forEach((_) => (newObj[_] = newState[_]))
    onChange(newObj)
  }

  const updateItemsList = (newItemText: string) => {
    const isValid = validate && validate(newItemText)
    setInvalidItem(!!isValid)

    const itemsList = objKeys(itemsState)
    const currentId = Math.max(itemsList.length - 1, 0)
    const newState = {
      ...itemsState,
      [currentId]: {
        text: newItemText,
        id: currentId,
      },
    }
    setItemsState(newState)
    callOnChange(newState)
  }

  const saveAndMakeNewItem = () => {
    const shouldUpdate = validate ? validate(latestItemText) : true
    if (!shouldUpdate) {
      setInvalidItem(true)
      return
    } else {
      setInvalidItem(false)
    }

    const newId = objKeys(itemsState).length
    const newState = {
      ...itemsState,
      [newId]: {
        text: "",
        id: newId,
      },
    }
    setItemsState(newState)
  }

  const handleDeleteOrNewItem: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (
      (event.which === Key.Delete || event.which === Key.Backspace) &&
      !latestItemText
    ) {
      const allItemIds = objKeys(itemsState)
      const lastItemId = allItemIds[allItemIds.length - 1]
      if (lastItemId) {
        delete itemsState[lastItemId]
        const newState = { ...itemsState }
        setItemsState(newState)
        callOnChange(newState)
      }
    } else if (event.which === Key.Enter) {
      saveAndMakeNewItem()
    }
  }

  const itemIds = objKeys(itemsState).sort()
  const itemIdsToPillify = itemIds.slice(0, itemIds.length - 1)

  return (
    <div className="flex flex-grow flex-wrap items-center">
      {itemIdsToPillify.map((itemId) => {
        const item = itemsState[itemId]
        return (
          <div
            className="mr-2 flex items-center justify-center rounded-md border-2 bg-gray-200 p-1 text-sm"
            key={itemId}
          >
            <div className="mr-2">{item.text}</div>
            <XIcon
              onClick={() => {
                delete itemsState[itemId]
                const newState = { ...itemsState }

                setItemsState(newState)
                callOnChange(newState)
              }}
              className="h-4 w-4"
            ></XIcon>
          </div>
        )
      })}

      <div className="flex h-full flex-grow items-center">
        <input
          className={classNames(
            "focus:outline-none rounded-md border-2 p-2 text-sm",
            {
              "border-red-400": invalidItem,
            }
          )}
          value={latestItemText || ""}
          onKeyDown={handleDeleteOrNewItem}
          onChange={(_) => updateItemsList(_.target.value)}
          placeholder={placeholder || "add..."}
        ></input>
        <div className="ml-3">
          <PlusIcon
            onClick={saveAndMakeNewItem}
            className="w-r h-4 cursor-pointer"
          ></PlusIcon>
        </div>
      </div>
    </div>
  )
}
