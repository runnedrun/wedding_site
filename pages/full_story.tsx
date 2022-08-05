import { combine } from "@/data/paramObsBuilders/combine"
import { CSVDownload } from "react-csv"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"

import { filtered } from "@/data/paramObsBuilders/filtered"
import { map } from "rxjs"
import { RsvpYes } from "@/data/types/RsvpYes"
import { runWith } from "firebase-functions/v1"
import Link from "next/link"

const BothStoriesPage = () => {
  return (
    <div className=" flex flex-col items-center p-10">
      <div className=" max-w-xl">
        <div className="mb-5 text-2xl">
          Check out these videos explaining how David and Xinqing met and fell
          in love:
        </div>
        <div className="mb-10">
          <div>
            <div className="mb-5 text-xl">The REAL version:</div>
            <div>
              <Link href={"https://www.youtube.com/watch?v=gpY-e9gVqTE"}>
                <div className=" mb-5 cursor-pointer rounded-md border-4 bg-blue-200 p-5">
                  View Video
                </div>
              </Link>
            </div>
            <div>
              <Link href={"/fake_story_script"}>
                <div className=" cursor-pointer rounded-md border-4 bg-blue-200 p-5">
                  View Transcript
                </div>
              </Link>
            </div>
          </div>

          <div className="mb-5 mt-5 text-xl">
            The version written by our wedding guests:
          </div>
          <a
            className=" mb-5 block cursor-pointer rounded-md border-4 bg-blue-200 p-5"
            href="https://youtu.be/e0Q0IX8rWzk"
          >
            View Video
          </a>
          <div>
            <Link href={"/fake_story_script"}>
              <div className=" cursor-pointer rounded-md border-4 bg-blue-200 p-5">
                View Transcript
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

BothStoriesPage.displayName = "BothStoriesPage"

export default BothStoriesPage
