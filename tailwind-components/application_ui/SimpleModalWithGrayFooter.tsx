import React, { ReactElement } from "react"
import { Fragment, useRef, ReactNode } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/outline"

interface content {
  title: string
  description?: string
  acceptButtonLabel: string
  cancelButtonLabel: string
}

interface ModalAssets {
  icon?: ReactNode
  acceptButtonClass?: String
  cancelButtonClass?: String
}

export interface SimpleModalWithGrayFooterProps {
  content?: content
  assets?: ModalAssets
  onCancel: () => void
  onConfirm?: () => void
  open: boolean
  modalBody?: ReactElement
  shareHyliteModal?: boolean
}

export const exampleProps: SimpleModalWithGrayFooterProps = {
  content: {
    title: "Deactivate account",
    description: `
    Are you sure you want to deactivate your account? 
    All of your data will be permanently removed. 
    This action cannot be undone.
    `,
    acceptButtonLabel: "Deactivate",
    cancelButtonLabel: "Cancel",
  },
  open: true,
  assets: {
    icon: <ExclamationIcon />,
  },
  onCancel: () => {},
  onConfirm: () => {},
  modalBody: <div></div>,
  shareHyliteModal: false,
}

export const SimpleModalWithGrayFooter = ({
  open,
  onCancel,
  onConfirm,
  assets,
  content,
}: SimpleModalWithGrayFooterProps) => {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => onCancel()}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
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
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    {assets?.icon}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {content.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {content.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className={`focus:outline-none inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${assets?.acceptButtonClass}`}
                  onClick={onConfirm}
                >
                  {content.acceptButtonLabel}
                </button>
                <button
                  type="button"
                  className={`focus:outline-none mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${assets?.cancelButtonClass}`}
                  ref={cancelButtonRef}
                  onClick={onCancel}
                >
                  {content.cancelButtonLabel}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
