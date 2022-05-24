import React, { useEffect } from "react"
import { useState, ReactNode } from "react"
import { InputGroup } from "./input_groups/InputGroup"

interface SignInProvider {
  iconComponent?: ReactNode
  text: string
  onClick: Function
}
interface ImageDescriptor {
  src: string
  alt?: string
}

export interface SplitScreenSigninProps {
  alternativeCTA?: {
    text: string
    href: string
  }
  logoImage?: ImageDescriptor
  additionalAuthProviders?: SignInProvider[]
  forgotPasswordHref?: string
  signInFn: (email: string, password: string, rememberMe: boolean) => void
  splitScreenComponent: React.ReactNode
  signUpMode?: boolean
  mobileWelcomeMessage?: { title: string; subtitle: string }
  error?: string
}

export const exampleProps: SplitScreenSigninProps = {
  alternativeCTA: {
    text: "start your 14-day free trial",
    href: "#",
  },
  logoImage: {
    src: "https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg",
    alt: "workflow",
  },
  forgotPasswordHref: "#",
  signInFn: () => {},
  splitScreenComponent: (
    <img
      className="absolute inset-0 h-full w-full object-cover"
      src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
    />
  ),
  additionalAuthProviders: [
    {
      text: "Sign in with Facebook",
      iconComponent: (
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
            clipRule="evenodd"
          />
        </svg>
      ),
      onClick: () => {},
    },
  ],
}

export const SplitScreenSignIn = ({
  alternativeCTA,
  logoImage,
  additionalAuthProviders = [],
  forgotPasswordHref,
  signInFn,
  splitScreenComponent,
  signUpMode,
  mobileWelcomeMessage,
  error,
}: SplitScreenSigninProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >("")

  const [triedToSubmit, setTriedToSubmit] = useState<boolean>()

  useEffect(() => {
    if (!signUpMode) return
    const shouldShowError =
      (triedToSubmit && !confirmPassword) ||
      (confirmPassword && confirmPassword !== password)

    shouldShowError
      ? setConfirmPasswordError("Passwords do not match")
      : setConfirmPasswordError(undefined)
  }, [confirmPassword, password, triedToSubmit])

  const validateCredentialsBeforeSignUpOrIn = () => {
    setTriedToSubmit(true)
    if (confirmPasswordError) return
    if ((!confirmPassword && signUpMode) || !password || !username) return

    signInFn(username, password, rememberMe)
  }

  const additionalAuthProvidersComponent = additionalAuthProviders.length ? (
    <div>
      <div>
        <p className="text-sm font-medium text-gray-700">
          {signUpMode ? "Sign up with" : "Sign in with"}
        </p>
        <div className="mt-1 grid grid-cols-3 gap-3">
          {additionalAuthProviders.map((provider) => (
            <div key={provider.text}>
              <a
                onClick={() => provider.onClick()}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">{provider.text}</span>
                {provider.iconComponent}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
    </div>
  ) : (
    ""
  )

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-around py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {mobileWelcomeMessage && (
          <div className="mt-5 text-center lg:hidden">
            <div className="text-4xl font-bold">
              {mobileWelcomeMessage.title}
            </div>
            <div className="mt-5 text-2xl font-bold">
              {mobileWelcomeMessage.subtitle}
            </div>
          </div>
        )}
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            {logoImage && (
              <img
                className="h-12 w-auto"
                src={logoImage.src}
                alt={logoImage.alt}
              />
            )}
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {signUpMode
                ? "Sign up for an account"
                : "Sign in to your account"}
            </h2>
            {alternativeCTA && (
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <a
                  href={alternativeCTA.href}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {alternativeCTA.text}
                </a>
              </p>
            )}
          </div>

          <div className="mt-8">
            {additionalAuthProvidersComponent}
            {error && (
              <div className="text-base font-bold text-red-500">{error}</div>
            )}
            <div className="mt-6">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  validateCredentialsBeforeSignUpOrIn()
                  e.preventDefault()
                  return false
                }}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      className="focus:outline-none block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <InputGroup
                    label="Password"
                    onValueChange={setPassword}
                    type="password"
                    autoComplete="password"
                  />
                </div>
                <div className="space-y-1">
                  {signUpMode && (
                    <InputGroup
                      label="Confirm Password"
                      validationError={
                        confirmPasswordError
                          ? {
                              message: confirmPasswordError,
                            }
                          : undefined
                      }
                      onValueChange={setConfirmPassword}
                      type="password"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onClick={() => setRememberMe(!rememberMe)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  {forgotPasswordHref && !signUpMode && (
                    <div className="text-sm">
                      <a
                        href={forgotPasswordHref}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="focus:outline-none flex w-full justify-center rounded-md border border-transparent bg-primary-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                  >
                    {signUpMode ? "Sign up" : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        {splitScreenComponent}
      </div>
    </div>
  )
}

export default SplitScreenSignIn
