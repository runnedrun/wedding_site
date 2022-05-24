import React, {
  ReactNode,
  HTMLInputTypeAttribute,
  useRef,
  useState,
  ChangeEventHandler,
  InputHTMLAttributes,
} from "react"
import { QuestionMarkCircleIcon } from "@heroicons/react/solid"
import classNames from "classnames"
import { overrideTailwindClasses } from "tailwind-override"

interface Icon {
  position?: string
  icon?: ReactNode
}

export interface ValidationError {
  message?: string
  icon?: ReactNode
}

interface AddOn {
  inline?: boolean
  text?: string
  trailingDropdown?: ReactNode
  leadingDropdown?: ReactNode
  trailingButtonContent?: ReactNode
}

export interface InputProps {
  label?: string
  name?: string
  id?: string
  defaultValue?: any
  type?: HTMLInputTypeAttribute
  placeholder?: string
  helpText?: string
  cornerHint?: string
  icon?: Icon
  addOn?: AddOn
  insetLabel?: boolean
  overlappingLabel?: boolean
  pillShape?: boolean
  grayBackgroundBorderBottom?: boolean
  keyboardShortcut?: string
  onValueChange: (value: string) => void
  className?: string
  autoComplete?: string
  disabled?: boolean
  validationError?: ValidationError
  value?: string
  highlight?: boolean
}

export const exampleProps: InputProps = {
  label: "Account number",
  name: "email",
  id: "email",
  defaultValue: "",
  type: "text",
  placeholder: "000-00-0000",
  icon: {
    position: "right",
    icon: (
      <QuestionMarkCircleIcon
        className="h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
    ),
  },
  onValueChange: () => {},
}

export type AllInputProps = InputProps &
  Partial<InputHTMLAttributes<HTMLInputElement>>

export const InputGroupForwardRef = React.forwardRef<
  HTMLInputElement,
  AllInputProps
>(
  (
    {
      label,
      name,
      id,
      defaultValue,
      type = "text",
      placeholder,
      helpText,
      cornerHint,
      icon,
      addOn = { inline: false },
      insetLabel,
      overlappingLabel,
      pillShape,
      grayBackgroundBorderBottom,
      keyboardShortcut,
      onValueChange,
      className,
      autoComplete,
      disabled,
      validationError,
      value: valueOverride,
      highlight,
      ...otherProps
    },
    ref
  ) => {
    const [clicked, setClicked] = useState<boolean>()
    const validatedOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const value =
        type === "checkbox" ? !!e.target.checked : e.target.value || ""
      onValueChange(String(value))
    }

    const defaultInputClasses =
      "block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    const inputClasses = addOn?.trailingButtonContent
      ? "focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
      : addOn?.leadingDropdown
      ? "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
      : validationError
      ? "block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
      : icon?.position === "left"
      ? `${defaultInputClasses} pl-10`
      : !addOn?.inline && addOn?.text
      ? "flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
      : addOn?.inline && addOn?.text
      ? "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 sm:pl-14 sm:text-sm border-gray-300 rounded-md"
      : pillShape
      ? "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
      : defaultInputClasses

    const labelClasses = "block text-sm font-medium text-gray-700"
    return (
      <div className={classNames(className)}>
        {insetLabel || overlappingLabel || grayBackgroundBorderBottom ? (
          <div
            className={classNames(
              { "flex flex-col": type === "checkbox" },
              insetLabel
                ? "rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                : overlappingLabel
                ? "relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600"
                : grayBackgroundBorderBottom
                ? "mt-1 border-b border-gray-300 focus-within:border-indigo-600"
                : ""
            )}
          >
            <label
              htmlFor={name}
              className={
                insetLabel
                  ? "block text-xs font-medium text-gray-900"
                  : overlappingLabel
                  ? "absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  : ""
              }
            >
              {label}
            </label>
            <input
              onClick={() => setClicked(true)}
              {...otherProps}
              value={valueOverride}
              defaultValue={defaultValue}
              defaultChecked={defaultValue === "true"}
              disabled={disabled}
              ref={ref}
              type={type}
              autoComplete={autoComplete}
              name={name}
              id={id}
              onChange={validatedOnChange}
              className={classNames({
                "block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm":
                  insetLabel || overlappingLabel,
                "mt-1 block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm": grayBackgroundBorderBottom,
                "bg-amber-200": highlight && !clicked,
              })}
              placeholder={placeholder}
            />
          </div>
        ) : (
          <div
            className={classNames({
              "flex align-middle": type === "checkbox",
            })}
          >
            <div className={classNames("flex justify-between")}>
              <label
                htmlFor={name}
                className={
                  pillShape ? `ml-px pl-4 ${labelClasses}` : labelClasses
                }
              >
                {label}
              </label>
              {cornerHint && (
                <span className="text-sm text-gray-500" id="email-optional">
                  {cornerHint}
                </span>
              )}
            </div>
            <div className="relative mt-1 flex rounded-md shadow-sm">
              {icon?.position === "left" && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {icon?.icon}
                </div>
              )}
              {addOn?.leadingDropdown ? (
                <div className="absolute inset-y-0 left-0 flex items-center">
                  {addOn?.leadingDropdown}
                </div>
              ) : addOn?.inline && addOn?.text ? (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span
                    className={
                      addOn?.inline
                        ? "text-gray-500 sm:text-sm"
                        : "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                    }
                  >
                    {addOn?.text}
                  </span>
                </div>
              ) : addOn && !addOn?.inline && addOn?.text ? (
                <span
                  className={
                    addOn?.inline
                      ? "text-gray-500 sm:text-sm"
                      : "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  }
                >
                  {addOn?.text}
                </span>
              ) : null}
              <input
                onClick={() => setClicked(true)}
                {...otherProps}
                value={valueOverride}
                disabled={disabled}
                ref={ref}
                type={type}
                autoComplete={autoComplete}
                name={name}
                id={id}
                defaultChecked={defaultValue === "true"}
                className={overrideTailwindClasses(
                  classNames(
                    inputClasses,
                    {
                      "animate-pulse-once bg-yellow-200": highlight && !clicked,
                    },
                    { "ml-2 w-4": type === "checkbox" }
                  )
                )}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={validatedOnChange}
              />
              {icon?.position === "right" ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {icon?.icon}
                </div>
              ) : addOn?.trailingDropdown ? (
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {addOn?.trailingDropdown}
                </div>
              ) : addOn?.trailingButtonContent ? (
                <button
                  type="button"
                  className="focus:outline-none relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {" "}
                  {addOn?.trailingButtonContent}{" "}
                </button>
              ) : keyboardShortcut ? (
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                    {keyboardShortcut}
                  </kbd>
                </div>
              ) : null}
              {validationError && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {validationError?.icon}
                </div>
              )}
            </div>
            {validationError && (
              <p className="mt-2 text-sm text-red-600">
                {validationError?.message}
              </p>
            )}
            {helpText && (
              <p className="mt-2 text-sm text-gray-500">{helpText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

export const InputGroup = (props: AllInputProps) => {
  const ref = useRef(null)
  return <InputGroupForwardRef ref={ref} {...props}></InputGroupForwardRef>
}
