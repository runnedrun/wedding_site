import { getAbsoluteUrl } from "@/helpers/getAbsoluteUrl"
export const redirectWithDestination = (path: string) => ({ ctx }) => {
  return `${path}?destination=${encodeURIComponent(
    getAbsoluteUrl(ctx).toString()
  )}`
}
