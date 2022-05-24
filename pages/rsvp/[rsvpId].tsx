import { docForKey } from "@/data/firebaseObsBuilders/docForKey"
import { EditingState, fbWriter } from "@/data/firebaseObsBuilders/fbWriter"
import { combine } from "@/data/paramObsBuilders/combine"
import { stringParam } from "@/data/paramObsBuilders/stringParam"
import { Button } from "@/tailwind-components/application_ui/Button"
import { ClickablePillDisplay } from "@/tailwind-components/application_ui/input_groups/ClickablePillDisplay"
import TextArea from "@/tailwind-components/application_ui/input_groups/TextArea"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"
import { Head } from "next/document"
import { useRouter } from "next/router"
import { tap } from "rxjs"
useRouter

type RsvpShellProps = {
  email: React.ReactNode
  names: React.ReactNode
  dietaryRestrictions: React.ReactNode
}

const RsvpShell = ({ email, names, dietaryRestrictions }: RsvpShellProps) => {
  return (
    <div>
      <div>
        <div>Your email:</div>
        {email}
      </div>
      <div>
        <div>Whose attending</div>
        {names}
      </div>
      <div>
        <div>Dietary Restrictions</div>
        {dietaryRestrictions}
      </div>
      <div></div>
    </div>
  )
}
const data = combine({
  writer: fbWriter("rsvpYes", docForKey("rsvpYes", stringParam("rsvpId"))),
})

const RsvpPage = component(
  () => data,
  { hideWhen: (props) => !props.writer?.currentData },
  ({
    writer: {
      currentData,
      isEditing,
      setEditingState,
      editingState,
      updateField,
    },
  }) => {
    const names = currentData.names || []
    const readableDisplay = (
      <RsvpShell
        email={<div className="mb-5">{currentData.email}</div>}
        names={
          <div className="flex flex-col">
            {names.map((name) => {
              return <div key={name}>{name}</div>
            })}
          </div>
        }
        dietaryRestrictions={<div>{currentData.dietaryRestrictions}</div>}
      />
    )

    const pillItems = names.map((_) => ({
      id: _,
      text: _,
    }))
    const editingDisplay = (
      <RsvpShell
        email={
          <div className="mb-5">
            <input
              defaultValue={currentData.email}
              type="text"
              onChange={(_) => updateField("email", _.target.value)}
            ></input>
          </div>
        }
        names={
          <div className="mb-5">
            <ClickablePillDisplay
              items={pillItems}
              onChange={(allValues) => {
                updateField(
                  "names",
                  Object.values(allValues).map((_) => _.text)
                )
              }}
            ></ClickablePillDisplay>
          </div>
        }
        dietaryRestrictions={
          <TextArea
            onChange={(_) => updateField("dietaryRestrictions", _)}
            defaultValue={currentData.dietaryRestrictions}
          ></TextArea>
        }
      />
    )

    const dataDisplay = isEditing ? editingDisplay : readableDisplay

    const editOrSaveButton = isEditing ? (
      <Button
        buttonAssets={{
          text: "Save",
        }}
        onClick={() => setEditingState(EditingState.Saved)}
      />
    ) : (
      <Button
        buttonAssets={{
          text: "Edit",
        }}
        onClick={() => setEditingState(EditingState.Editing)}
      />
    )

    const cancelButton = isEditing ? (
      <Button
        buttonAssets={{
          text: "Cancel",
        }}
        onClick={() => setEditingState(EditingState.Cancelled)}
        secondary
      />
    ) : (
      <div></div>
    )

    return (
      <div className="mt-5">
        <Head>
          <title>Edit your RSVP for Xinqing and David's Wedding!</title>
          <meta
            name="description"
            content="Our wedding is gonna be awesome, we hope you can come!"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mb-5">Your RSVP:</div>
        <div className="mb-5">{dataDisplay}</div>
        <div className="flex flex-wrap">
          {cancelButton}
          {editOrSaveButton}
        </div>
      </div>
    )
  }
)

RsvpPage.displayName = "RsvpPage"

export const getServerSideProps = buildPrefetchHandler(data)

export default RsvpPage
