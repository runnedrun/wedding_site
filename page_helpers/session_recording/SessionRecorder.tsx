import { creators, setters } from "@/data/fb"
import { jsonifyTimestamps } from "@/data/fetchHelpers/jsonifyTimestamps"
import { Model } from "@/data/baseTypes/Model"
import { SessionRecord } from "@/data/types/SessionRecord"
import { omit } from "lodash"
import { generateKeyForComponent } from "./generateKeyForComponent"
import { ForeignKey } from "@/data/baseTypes/ForeignKey"

const sessionData = {}
type StateAndProps = {
  global: { state: any; props: any }
  components: { [key: string]: { state: any } }
}
const stateAndProps: StateAndProps = {
  global: {} as any,
  components: {},
}

export const recordDoc = (collectionName: string, data: Model<any, any>) => {
  sessionData[collectionName] = sessionData[collectionName] || {}
  sessionData[collectionName][data.uid] = omit(data, "uid")
}

export const recordQuery = (
  collectionName: string,
  data: Model<any, any>[]
) => {
  data.forEach((data) => {
    const docId = data.uid
    recordDoc(collectionName, data)
  })
}

const getViewport = () => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    deviceScaleFactor: window.devicePixelRatio,
  }
}
type PersistOptions = {
  bugReport?: boolean
}
export const persistSession = async ({
  bugReport,
}: PersistOptions): Promise<SessionRecord> => {
  const dataToPersist = {
    data: JSON.stringify(jsonifyTimestamps(sessionData)),
    stateAndProps: JSON.stringify(jsonifyTimestamps(stateAndProps)),
    path,
    nextPathName: pathname,
    viewport: getViewport(),
    devOnly: process.env.NODE_ENV !== "production",
  }

  const ref = await creators.dev_SessionRecord(dataToPersist)

  logRocketSessionUrlPromise.then((logRocketUrl) =>
    setters.dev_SessionRecord(ref.id, { logRocketUrl })
  )

  const timedPromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, 3000)
  })

  const logRocketUrlOrTimeout = await Promise.race([
    timedPromise,
    logRocketSessionUrlPromise,
  ])

  return {
    ...dataToPersist,
    uid: ref.id as ForeignKey<"dev_SessionRecord">,
    logRocketUrl: logRocketUrlOrTimeout,
  }
}

export const setGlobalStateAndProps = (stateAndPropsToSet: {
  state?: any
  props?: any
}) => {
  stateAndProps.global = { ...stateAndProps.global, ...stateAndPropsToSet }
}

export const setComponentStateAndProps = (
  componentName: string,
  stateAndPropsToSet: {
    state?: any
    props?: any
  }
) => {
  const props = stateAndPropsToSet.props || {}
  const componentId = generateKeyForComponent(componentName, props)
  stateAndProps.components[componentId] =
    stateAndProps.components[componentId] || ({} as any)
  stateAndProps.components[componentId] = {
    ...stateAndProps.components[componentId],
    ...stateAndPropsToSet,
  }
}

let path = ""
export const setPath = (pathToSet: string) => {
  path = pathToSet
}

let resolveLogRocketSessionUrlPromise = null
let logRocketSessionUrlPromise = new Promise<string>((res) => {
  resolveLogRocketSessionUrlPromise = res
})

let pathname = ""
export const setPathname = (pathnameToSet: string) => {
  pathname = pathnameToSet
}

export const setLogRocketSessionUrl = (url: string) => {
  resolveLogRocketSessionUrlPromise(url)
}
