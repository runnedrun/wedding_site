import { docForKey } from "@/data/firebaseObsBuilders/docForKey"
import { EditingState, fbWriter } from "@/data/firebaseObsBuilders/fbWriter"
import { boolParam } from "@/data/paramObsBuilders/boolParam"
import { combine } from "@/data/paramObsBuilders/combine"
import { stringParam } from "@/data/paramObsBuilders/stringParam"
import { InputGroup } from "@/tailwind-components/application_ui/input_groups/InputGroup"
import TextArea from "@/tailwind-components/application_ui/input_groups/TextArea"
import { EditingControls } from "@/views/rsvp/EditingControls"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { component } from "@/views/view_builder/component"
import isEmail from "is-email"
import { useEffect } from "react"

const dataFn = () => {
  return combine({
    writer: fbWriter("rsvpNo", docForKey("rsvpNo", stringParam("regretId")), {
      beforeWrite: ({ data, setError }) => {
        if (!data.email || !isEmail(data.email)) {
          setError("email", "You must enter an email")
        }
        if (!data.name) {
          setError("name", "Let us know who you are!")
        }
        return data
      },
    }),
    startEditing: boolParam("startEditing", false),
  })
}

const Shell = ({ email, notes, name }) => {
  return (
    <div className="mt-5">
      <div className="mb-5">
        <div className="text-xl">Email:</div>
        {email}
      </div>
      <div className="mb-5">
        <div className="text-xl">Name:</div>
        {name}
      </div>
      <div>
        <div className="text-xl">Notes:</div>
        {notes}
      </div>
    </div>
  )
}

const PageView = component(
  dataFn,
  {
    hideWhen: (props) => {
      return !props.writer?.currentData || !props.writer?.setEditingState
    },
  },
  ({
    writer: { updateField, currentData, errors, isEditing, setEditingState },
    startEditing,
  }) => {
    useEffect(() => {
      if (startEditing) {
        setEditingState(EditingState.Editing)
      }
    }, [startEditing])

    const editable = (
      <Shell
        email={
          <InputGroup
            className="w-72"
            defaultValue={currentData.email}
            type="text"
            onValueChange={(_) => updateField("email", _)}
            validationError={errors.byKey.email}
          ></InputGroup>
        }
        name={
          <InputGroup
            className="w-72"
            defaultValue={currentData.name}
            type="text"
            onValueChange={(_) => updateField("name", _)}
            validationError={errors.byKey.name}
          ></InputGroup>
        }
        notes={
          <TextArea
            onChange={(_) => updateField("notes", _)}
            defaultValue={currentData.notes}
            rowCount={2}
          ></TextArea>
        }
      ></Shell>
    )

    const readonly = (
      <Shell
        email={<div>{currentData.email}</div>}
        name={<div>{currentData.name}</div>}
        notes={<div>{currentData.notes}</div>}
      ></Shell>
    )

    return (
      <div className="flex flex-col items-center bg-pink-50 pt-5 pb-10">
        <div className="max-w-xl p-5">
          <div className="mb-5 text-center text-2xl">Regrets</div>
          <div>
            We'll miss you! However, we'll be around the East Coast from 7/30 -
            8/17— perhaps we can meet up outside of the wedding weekend!
          </div>
          <div>
            Let us know in the notes if there's a time we might be able to catch
            up.
          </div>
          {isEditing ? editable : readonly}
          <div className="mt-5 flex justify-center">
            <EditingControls
              setEditingState={setEditingState}
              isEditing={isEditing}
              errors={errors}
              hideCancelButton={startEditing}
            ></EditingControls>
          </div>
        </div>
      </div>
    )
  }
)

export const getServerSideProps = buildPrefetchHandler(dataFn)

export default PageView
