import { persistSession } from "@/page_helpers/session_recording/SessionRecorder"
import { LightBulbIcon } from "@heroicons/react/outline"
import classNames from "classnames"

interface Userback {
  show: () => {}
  hide: () => {}
  open: (type?: string) => {}
  setData: (obj: any) => {}
  afterSend: (data: any) => void
}

declare global {
  interface Window {
    Userback: Userback
  }
}

export const SaveSessionButton = () => {
  const createSessionAndOpenDiaologue = async () => {
    persistSession({})
  }

  const button =
    process.env.NEXT_PUBLIC_HIDE_FEEDBACK_BUTTON === "true" ? (
      <div className="h-6 w-6"></div>
    ) : (
      <div className="rounded-md bg-primary-500 p-1">
        <LightBulbIcon
          className={classNames("h-5 w-5")}
          stroke="white"
        ></LightBulbIcon>
      </div>
    )

  return (
    <div
      className={classNames("fixed top-2 right-2 cursor-pointer")}
      onClick={() => {
        createSessionAndOpenDiaologue()
      }}
    >
      {button}
    </div>
  )
}
