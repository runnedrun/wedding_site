import { combine } from "@/data/paramObsBuilders/combine"
import { CSVDownload } from "react-csv"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"

import { filtered } from "@/data/paramObsBuilders/filtered"
import { map } from "rxjs"
import { RsvpYes } from "@/data/types/RsvpYes"
import { runWith } from "firebase-functions/v1"

const dataFn = () =>
  combine({
    allRsvps: filtered("rsvpYes").pipe(
      map((_) =>
        _.sort((a, b) => a.updatedAt?.toMillis() - b.updatedAt?.toMillis())
      )
    ),
  })

const storyStart =
  "Once upon a time Xinqing and David were living happily in Nairobi, not knowing each other. They liked their lives but they felt like something was missing..."

const StoryPage = component(dataFn, ({ allRsvps }) => {
  const rows = [...allRsvps].sort(
    (a, b) => a.updatedAt?.toMillis() - b.updatedAt?.toMillis()
  )

  rows.unshift({ storyAddition: storyStart } as RsvpYes)

  return (
    <div className="p-10">
      <div className="mb-5 text-2xl">How Xinqing and David met</div>
      {rows
        .filter((_) => !_.hidden)
        .map((row, i) => {
          return (
            <div className="mb-5" key={i}>
              {row.names && (
                <div className="mb-2 text-lg font-bold">
                  {row.names.join(", ")}
                </div>
              )}
              <div>{row.storyAddition}</div>
            </div>
          )
        })}
    </div>
  )
})

StoryPage.displayName = "StoryPage"

export const getServerSideProps = buildPrefetchHandler(dataFn)

export default StoryPage
