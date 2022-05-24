import { Model } from "../baseTypes/Model"

export type SessionRecord = Model<
  "dev_SessionRecord",
  {
    data: string
    stateAndProps: string
    path: string
    nextPathName: string
    viewport: {
      width: number
      height: number
      deviceScaleFactor: number
    }
    logRocketUrl?: string
    devOnly?: boolean
  }
>
