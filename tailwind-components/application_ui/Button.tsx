import React from "react"
import { ReactNode } from "react"
import classNames from "classnames"

interface Icon {
  buttonIcon?: ReactNode
}
interface ButtonAssets {
  text?: string
  icon?: Icon
}

export interface ButtonProps {
  primary?: boolean
  secondary?: boolean
  white?: boolean
  isLeadingIcon?: boolean
  round?: boolean
  buttonAssets: ButtonAssets
  className?: string
  onClick: () => void
  disabled?: boolean
}

export const exampleProps: ButtonProps = {
  primary: false,
  secondary: true,
  white: false,
  isLeadingIcon: false,
  round: false,
  buttonAssets: {
    text: "Button text",
    icon: {
      buttonIcon: (
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      ),
    },
  },
  onClick: () => {},
}

export const Button = ({
  primary,
  secondary,
  white,
  isLeadingIcon,
  round,
  buttonAssets,
  className,
  onClick,
  disabled,
}: ButtonProps) => {
  const defaultMode = !primary && !secondary
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        type="button"
        className={`justify-center ${classNames({
          "inline-flex items-center border px-2.5 py-1.5": buttonAssets.text,
          "focus:outline-none rounded border-transparent bg-primary-400 text-xs font-medium text-white shadow-sm hover:bg-primary-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2":
            primary || defaultMode,
          "text-secondary-700 bg-secondary-100 hover:bg-secondary-200 focus:outline-none rounded border-transparent text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2": secondary,
          "focus:outline-none rounded border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2": white,
          "inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium": round,
          "inline-flex items-center rounded-full border border-transparent p-1 shadow-sm focus:ring-indigo-500 focus:ring-offset-2": !buttonAssets.text,
          [className]: true,
          "opacity-30": disabled,
        })}`}
      >
        {!isLeadingIcon && buttonAssets.text}
        {!isLeadingIcon && buttonAssets.icon?.buttonIcon}

        {isLeadingIcon && buttonAssets.icon?.buttonIcon}
        {isLeadingIcon && buttonAssets.text}
      </button>
    </>
  )
}
