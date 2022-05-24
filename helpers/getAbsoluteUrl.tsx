import { GetServerSidePropsContext } from "next"
import absoluteUrl from "next-absolute-url"

export const getAbsoluteUrl = (ctx: GetServerSidePropsContext): URL => {
  const isServerSide = typeof window === "undefined"
  const origin = isServerSide
    ? absoluteUrl(ctx.req).origin
    : window.location.origin
  const destPath =
    typeof window === "undefined" ? ctx.resolvedUrl : window.location.href
  return new URL(destPath, origin)
}
