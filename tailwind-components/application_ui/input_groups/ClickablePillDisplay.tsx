import { objKeys } from "@/helpers/objKeys"
import { Item } from "@/tailwind-components/application_ui/TypeaheadDropdown"
import { XIcon } from "@heroicons/react/solid"
import classNames from "classnames"
import { useState } from "react"
import { Key } from "ts-keycode-enum"

interface PropsTypes {
  items: Record<string, Item> | Array<Item>
  onChange: (newItems: Record<string, Item>) => void
  validate?: (newItem: string) => Boolean
}

export const ClickablePillDisplay = ({
  items,
  onChange,
  validate,
}: PropsTypes) => {
  const [itemsState, setItemsState] = useState(items as Record<string, Item>)
  const [newItemText, setNewItemText] = useState("")
  const [invalidItem, setInvalidItem] = useState(false)

  const handleDeleteOrNewItem: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (
      (event.which === Key.Delete || event.which === Key.Backspace) &&
      !newItemText
    ) {
      const allItemIds = objKeys(itemsState)
      const lastItemId = allItemIds[allItemIds.length - 1]
      if (lastItemId) {
        delete itemsState[lastItemId]
        setItemsState({ ...itemsState })
      }
    }

    if (event.which === Key.Enter) {
      const shouldUpdate = validate ? validate(newItemText) : true
      if (!shouldUpdate) {
        setInvalidItem(true)
        return
      } else {
        setInvalidItem(false)
      }

      setNewItemText("")
      const newId = `new--${newItemText}`
      const newState = {
        ...itemsState,
        [newId]: {
          text: newItemText,
          id: newId,
        },
      }
      setItemsState(newState)
      onChange(newState)
    }
  }

  return (
    <div className="flex flex-grow flex-wrap items-center">
      {objKeys(itemsState).map((itemId) => {
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
                onChange(newState)
              }}
              className="h-4 w-4"
            ></XIcon>
          </div>
        )
      })}

      <div className="h-full flex-grow">
        <input
          className={classNames(
            "focus:outline-none rounded-md border-2 p-2 text-sm",
            {
              "border-red-400": invalidItem,
            }
          )}
          value={newItemText}
          onKeyDown={handleDeleteOrNewItem}
          onChange={(event) => {
            const isValid = validate && validate(event.target.value)
            if (isValid) {
              setInvalidItem(false)
            }
            setNewItemText(event.target.value)
          }}
          placeholder="add..."
        ></input>
      </div>
    </div>
  )
}
