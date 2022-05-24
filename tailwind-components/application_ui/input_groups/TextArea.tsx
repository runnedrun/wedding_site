import React from "react"

interface TextAreaProps {
  label?: string
  subtitle?: string
  defaultValue?: string
  name?: string
  rowCount?: number
  onChange: (text: string) => void
  validationError?: string
}

export const exampleProps: TextAreaProps = {
  label: "About",
  subtitle: "Write a few sentences about yourself",
  defaultValue: "I am a text area.",
  name: "about",
  rowCount: 4,
  onChange: () => {},
}

export const TextArea = ({
  label,
  subtitle,
  defaultValue = "",
  name,
  rowCount = 3,
  onChange,
  validationError,
  ...extraProps
}: TextAreaProps) => {
  return (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          onChange={(e) => onChange(e.target.value)}
          id={name}
          name={name}
          rows={rowCount}
          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          defaultValue={defaultValue}
          {...extraProps}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      <div className="text-sm text-red-400">{validationError}</div>
    </div>
  )
}

export default TextArea
