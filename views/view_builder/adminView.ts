import { isDemoMode } from "@/helpers/isDemoMode"
import { redirectWithDestination } from "@/helpers/redirectWithDestination"
import { Redirect } from "next"
import { SSRPropsContext, withAuthUserSSR } from "next-firebase-auth"

export const adminView = (
  nextHandler: (
    context: SSRPropsContext
  ) => Promise<{ props: any } | { redirect: Redirect }> = (_) =>
    Promise.resolve({ props: {} })
) => {
  const checkOrRedirect = (contextWithUser: SSRPropsContext) => {
    const user = contextWithUser.AuthUser

    if (!user?.email?.includes("@hylitepeople.com") && !isDemoMode()) {
      const redirectPath = redirectWithDestination("/sign_in")({ ctx: context })
      return Promise.resolve({
        redirect: {
          destination: redirectPath,
          permanent: false,
        },
      })
    } else {
      return Promise.resolve(nextHandler(contextWithUser))
    }
  }

  return withAuthUserSSR()(checkOrRedirect)
}
