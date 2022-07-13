import { combine } from "@/data/paramObsBuilders/combine"
import { CSVDownload } from "react-csv"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"

import { filtered } from "@/data/paramObsBuilders/filtered"
import { map } from "rxjs"
import { clone } from "lodash"
import { ConsoleView } from "react-device-detect"

const dataFn = () =>
  combine({
    allRsvps: filtered("rsvpYes").pipe(
      map((_) =>
        _.sort((a, b) => a.updatedAt?.toMillis() - b.updatedAt?.toMillis())
      )
    ),
  })

const RsvpPage = component(dataFn, ({ allRsvps }) => {
  const rows = allRsvps.map((rsvp) => {
    const otherTimes = rsvp.otherTimes
    console.log("other", otherTimes)
    const namesArray = rsvp.names
    const namesClean = namesArray.flatMap((nameOrNames) => {
      return nameOrNames.split(/and|,/g)
    })

    const dates = otherTimes
      ? {
          "friday night":
            otherTimes["8/5 Friday | 9PM | Casual drinks and hang"],
          "Sunday morning": otherTimes["8/7 Sunday | 11AM - 1PM | Brunch"],
          "Sunday afternoon": otherTimes["8/7 Sunday | Afternoon | TBD"],
          "Monday Morning": otherTimes["8/8 Monday | Morning | TBD"],
          "Monday Afternoon": otherTimes["8/9 Monday | Afternoon | TBD"],
          "Monday Eve": otherTimes["8/9  Monday | Evening | TBD"],
        }
      : {}
    return {
      attending: namesClean.join(", "),
      attendingCount: namesClean.length,
      dietaryRestrictions: rsvp.dietaryRestrictions,
      contact: rsvp.email,
      ...dates,
    }
  })

  console.log("rows", rows)

  return (
    <div>
      <CSVDownload data={rows} target="_blank">
        Exporting...
      </CSVDownload>
    </div>
  )
})

RsvpPage.displayName = "RsvpPage"

export const getServerSideProps = buildPrefetchHandler(dataFn)

export default RsvpPage
