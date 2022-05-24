export const generateKeyForComponent = (
  componentName: string,
  props: object
) => {
  const propsList = Object.entries(props).sort((a, b) => {
    return a[0].localeCompare(b[0])
  })
  return `${componentName}-${JSON.stringify(propsList)}`
}
