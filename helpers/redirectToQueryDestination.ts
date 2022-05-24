import { GetServerSidePropsContext } from "next"
import absoluteUrl from "next-absolute-url"

interface Props {
  ctx: GetServerSidePropsContext<any>
}
export const redirectToQueryDestination = ({ ctx }: Props) => {
  const isServerSide = typeof window === "undefined"
  const origin = isServerSide
    ? absoluteUrl(ctx.req).origin
    : window.location.origin

  const params = isServerSide
    ? new URL(ctx.req.url, origin).searchParams
    : new URLSearchParams(window.location.search)

  const destinationParamVal = params.get("destination")
    ? decodeURIComponent(params.get("destination"))
    : undefined

  let destURL = "/user"
  if (destinationParamVal) {
    // Verify the redirect URL host is allowed.
    // https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/11-Client_Side_Testing/04-Testing_for_Client_Side_URL_Redirect
    const allowedHosts = [
      "localhost:3000",
      "hylite-runnedrun-codefounder.vercel.app",
      "hylite-git-develop-codefounder.vercel.app",
      "test.hylitepeople.com",
      "send.hylitepeople.com",
    ]
    const allowed = allowedHosts.indexOf(new URL(destinationParamVal).host) > -1
    if (allowed) {
      destURL = destinationParamVal
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `Redirect destination host must be one of ${allowedHosts.join(", ")}.`
      )
    }
  }

  return destURL
}
