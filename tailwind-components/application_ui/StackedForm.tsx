import React from "react"

export interface FormGroup {
  header?: string
  subtitle?: string
  inputs: React.ReactNode[]
}

export interface FormButton {
  text?: string
  classNames?: string
  onTrigger: () => void
}

export interface FormButtons {
  cancel?: FormButton
  submit?: FormButton
  edit?: FormButton
}

export interface StackedFormProps {
  groups: FormGroup[]
  submitText?: string
  className?: string
  buttons: FormButtons
}

export const StackedForm = ({
  groups,
  className,
  buttons,
}: StackedFormProps) => {
  return (
    <div className={`${className} space-y-8 divide-y divide-gray-200`}>
      <div className="space-y-8 divide-y divide-gray-200">
        {groups.map((group, i) => {
          return (
            <div key={i}>
              {group.header && (
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {group.header}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{group.subtitle}</p>
                </div>
              )}
              {group.inputs.map((input, i) => (
                <div
                  key={i}
                  className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                >
                  {input}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          {buttons.edit && (
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              onClick={buttons.edit.onTrigger}
            >
              {buttons.edit.text || "Submit"}
            </button>
          )}
          {buttons.cancel && (
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={buttons.cancel.onTrigger}
            >
              {buttons.cancel.text || "Cancel"}
            </button>
          )}
          {buttons.submit && (
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              onClick={buttons.submit.onTrigger}
            >
              {buttons.submit.text || "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
