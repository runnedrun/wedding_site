export const isServerside = () => {
  return typeof window === "undefined"
}
