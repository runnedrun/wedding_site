import React, { Fragment, useCallback, useEffect, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"

function useHookWithRefCallback() {
  const ref = useRef(null)
  const setRef = useCallback((node: HTMLElement) => {
    if (node) {
      node.addEventListener(
        "click",
        (e) => {}
        // log any click events you want here
      )
    }

    ref.current = node
  }, [])

  return [setRef]
}

type Props = {
  onCancel: () => void
  open: boolean
  children: React.ReactNode
}

const SimpleModal = ({ open, onCancel, children }: Props) => {
  const [overlayRef] = useHookWithRefCallback()
  useEffect(() => {}, [open])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => onCancel()}
      >
        <div
          className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
          ref={overlayRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

SimpleModal.displayName = "SimpleModal"

export { SimpleModal }
