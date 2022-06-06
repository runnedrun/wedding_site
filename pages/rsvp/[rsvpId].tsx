import { docForKey } from "@/data/firebaseObsBuilders/docForKey"
import { EditingState, fbWriter } from "@/data/firebaseObsBuilders/fbWriter"
import { readOnlyBoolParam } from "@/data/paramObsBuilders/boolParam"
import { combine } from "@/data/paramObsBuilders/combine"
import { stringParam } from "@/data/paramObsBuilders/stringParam"
import { Button } from "@/tailwind-components/application_ui/Button"
import { ClickablePillDisplay } from "@/tailwind-components/application_ui/input_groups/ClickablePillDisplay"
import { InputGroup } from "@/tailwind-components/application_ui/input_groups/InputGroup"
import TextArea from "@/tailwind-components/application_ui/input_groups/TextArea"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"
import Head from "next/head"
import { useEffect } from "react"
import isEmail from "is-email"
import { filtered } from "@/data/paramObsBuilders/filtered"
import { map } from "rxjs"
import { OtherTimes } from "@/data/types/RsvpYes"
import { objKeys } from "@/helpers/objKeys"
import { EditingControls } from "@/views/rsvp/EditingControls"
import ordinal from "ordinal"

type RsvpShellProps = {
  email: React.ReactNode
  names: React.ReactNode
  otherTimes: React.ReactNode
  notes: React.ReactNode
  dietaryRestrictions: React.ReactNode
  previousPersonsAddition: React.ReactNode
  storyAddition: React.ReactNode
  storyPartNumber: number
}

const RsvpShell = ({
  email,
  names,
  otherTimes,
  dietaryRestrictions,
  notes,
  previousPersonsAddition,
  storyAddition,
  storyPartNumber,
}: RsvpShellProps) => {
  return (
    <div>
      <div className=" mb-5 text-lg">
        Our reception will run from 3PM - 7PM on Saturday August 6th. We're so
        glad you can make it!
      </div>
      <div className="mb-5">
        <div className="text-xl">Your email:</div>
        {email}
      </div>
      <div className="mb-5">
        <div className="text-xl">When will you be around?</div>
        <div className="mb-5 text-sm">
          In addition to the big party on Satuday we want to reserve time to
          spend with all the friends and family that are visiting! We'll reach
          out later to everyone who confirms they're free to coordinate exact
          details. For now, check the boxes below to let us know when you'll be
          available and interested in hanging out!
        </div>
        <div>{otherTimes}</div>
      </div>
      <div className="mb-5">
        <div className="text-xl">Who's attending</div>
        {names}
      </div>
      <div className="mb-5">
        <div className="text-xl">Dietary Restrictions</div>
        {dietaryRestrictions}
      </div>
      <div className="mb-5">
        <div className="text-xl">Notes</div>
        {notes}
      </div>
      <div>
        <div className="text-xl">Help us tell our story!</div>
        <div className="mb-5 text-sm">
          Each RSVPer has a chance to add to the (mostly made-up) story of how
          Xinqing and David met. However, you only get to see the previous
          person's addition to the story! During the party, we'll act out the
          whole story as part of our ceremony. Add your section to the story
          below, to complete your RSVP.
        </div>
        <div className="mb-5">
          <div className=" font-bold">Previous Person's Addition: </div>
          <div>{previousPersonsAddition}</div>
        </div>
        <div>
          <div className="font-bold">
            Your bit (you are the {ordinal(storyPartNumber)} story addition):
          </div>
          <div className="">{storyAddition}</div>
        </div>
      </div>
    </div>
  )
}
const dataFn = () =>
  combine({
    allRsvps: filtered("rsvpYes").pipe(
      map((_) =>
        _.sort((a, b) => a.updatedAt?.toMillis() - b.updatedAt?.toMillis())
      )
    ),
    writer: fbWriter("rsvpYes", docForKey("rsvpYes", stringParam("rsvpId")), {
      beforeWrite: ({ data, setError }) => {
        if (!data.names?.length) {
          setError("names", "You must enter at least one name.")
        }
        if (!data.email || !isEmail(data.email)) {
          setError("email", "you must enter an email")
        }
        if (!data.storyAddition) {
          setError(
            "storyAddition",
            "You must add to the story! Don't worry if it's totally silly!"
          )
        }
        return data
      },
    }),
    startEditing: readOnlyBoolParam("startEditing", false),
  })

const storyStart =
  "Once upon a time Xinqing and David were living happily in Nairobi, not knowing each other. They liked their lives but they felt like something was missing..."

const RsvpPage = component(
  dataFn,
  {
    hideWhen: (props) => {
      return !props.writer?.currentData || !props.writer?.setEditingState
    },
  },
  ({
    allRsvps,
    startEditing,
    writer: {
      currentData,
      isEditing,
      setEditingState,
      editingState,
      updateField,
      errors,
    },
  }) => {
    // isEditing = true
    useEffect(() => {
      if (startEditing) {
        setEditingState(EditingState.Editing)
      }
    }, [startEditing])
    const names = currentData.names || []

    const hiddenRemoved = allRsvps.filter((_) => !_.hidden)

    const thisRsvpIndexOrNeg1 = hiddenRemoved.findIndex((rsvp) => {
      return currentData.uid === rsvp.uid
    })

    const thisRsvpIndex =
      thisRsvpIndexOrNeg1 >= 0 ? thisRsvpIndexOrNeg1 : hiddenRemoved.length

    const previousRsvpIndex = thisRsvpIndex - 1

    const previousRsvpsStory =
      hiddenRemoved[previousRsvpIndex]?.storyAddition || storyStart

    const buildOtherTimesDisplay = (writable: boolean) => {
      return (
        <div className="flex flex-col">
          {objKeys(OtherTimes).map((otherTime) => {
            const label = OtherTimes[otherTime]
            const isSaturday = label === OtherTimes.SaturdayAfternoon
            return (
              <div className="mr-2 flex items-center" key={label}>
                <div className="mr-4">{label}</div>
                <input
                  disabled={isSaturday || !writable}
                  type={"checkbox"}
                  defaultChecked={
                    isSaturday ||
                    (currentData.otherTimes &&
                      currentData.otherTimes[otherTime])
                  }
                  onChange={(e) =>
                    updateField("otherTimes", {
                      ...currentData.otherTimes,
                      [label]: e.target.checked,
                    })
                  }
                ></input>
              </div>
            )
          })}
        </div>
      )
    }

    const readableDisplay = (
      <RsvpShell
        email={<div className="mb-5">{currentData.email}</div>}
        names={
          <div className="flex flex-wrap">
            {names.map((name) => {
              return (
                <div className="mr-1" key={name}>
                  {name},
                </div>
              )
            })}
          </div>
        }
        otherTimes={buildOtherTimesDisplay(false)}
        dietaryRestrictions={<div>{currentData.dietaryRestrictions}</div>}
        notes={<div>{currentData.notes}</div>}
        storyAddition={currentData.storyAddition}
        storyPartNumber={thisRsvpIndex + 1}
        previousPersonsAddition={previousRsvpsStory}
      />
    )

    const pillItems = names.map((_, i) => ({
      id: String(i),
      text: _,
    }))
    const editingDisplay = (
      <RsvpShell
        email={
          <div className="mb-5">
            <InputGroup
              className="w-72"
              defaultValue={currentData.email}
              type="text"
              onValueChange={(_) => updateField("email", _)}
              validationError={errors.byKey.email}
            ></InputGroup>
          </div>
        }
        names={
          <div className="mb-5">
            <ClickablePillDisplay
              placeholder="Add an attendee..."
              items={pillItems}
              onChange={(allValues) => {
                updateField(
                  "names",
                  Object.values(allValues).map((_) => _.text)
                )
              }}
            ></ClickablePillDisplay>
            <div className=" text-red-400">{errors.byKey.names?.message}</div>
          </div>
        }
        dietaryRestrictions={
          <TextArea
            onChange={(_) => updateField("dietaryRestrictions", _)}
            defaultValue={currentData.dietaryRestrictions}
            rowCount={2}
          ></TextArea>
        }
        otherTimes={buildOtherTimesDisplay(true)}
        notes={
          <TextArea
            onChange={(_) => updateField("notes", _)}
            defaultValue={currentData.notes}
            rowCount={2}
          ></TextArea>
        }
        previousPersonsAddition={previousRsvpsStory}
        storyPartNumber={thisRsvpIndex + 1}
        storyAddition={
          <div>
            <div className="text-red-400">
              {errors.byKey.storyAddition?.message}
            </div>
            <TextArea
              onChange={(_) => updateField("storyAddition", _)}
              defaultValue={currentData.storyAddition}
            ></TextArea>
          </div>
        }
      />
    )

    const dataDisplay = isEditing ? editingDisplay : readableDisplay

    return (
      <div className="flex justify-center bg-pink-50 pt-5">
        <Head>
          <title>Edit your RSVP for Xinqing and David's Wedding!</title>
          <meta
            name="description"
            content="Our wedding is gonna be awesome, we hope you can come!"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center p-5 pb-10">
          <div className="mb-5 text-3xl">Your RSVP</div>
          <div className=" mb-5 max-w-xl">{dataDisplay}</div>
          <EditingControls
            setEditingState={setEditingState}
            isEditing={isEditing}
            errors={errors}
            hideCancelButton={startEditing}
          ></EditingControls>
        </div>
      </div>
    )
  }
)

RsvpPage.displayName = "RsvpPage"

export const getServerSideProps = buildPrefetchHandler(dataFn)

export default RsvpPage
