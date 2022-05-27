import { EditingState, ErrorType } from "@/data/firebaseObsBuilders/fbWriter"
import { Button } from "@/tailwind-components/application_ui/Button"
import { toast } from "react-toastify"

type EditingControlsProps = {
  isEditing: boolean
  errors: ErrorType<any>
  setEditingState: (state: EditingState) => void
  hideCancelButton: boolean
}

export const EditingControls = ({
  errors,
  isEditing,
  setEditingState,
  hideCancelButton,
}: EditingControlsProps) => {
  const buttonClasses = "text-xl"

  const editOrSaveButton = isEditing ? (
    <Button
      buttonAssets={{
        text: "Save",
      }}
      disabled={errors.hasError}
      className={buttonClasses}
      onClick={() => {
        toast("RSVP saved! Check your email (maybe in spam).")
        setEditingState(EditingState.Saved)
      }}
    />
  ) : (
    <Button
      buttonAssets={{
        text: "Edit",
      }}
      className={buttonClasses}
      onClick={() => setEditingState(EditingState.Editing)}
    />
  )

  const cancelButton =
    isEditing && !hideCancelButton ? (
      <Button
        buttonAssets={{
          text: "Cancel",
        }}
        className={buttonClasses}
        onClick={() => setEditingState(EditingState.Cancelled)}
        secondary
      />
    ) : (
      <div></div>
    )

  return (
    <div className="mt-5 flex flex-wrap">
      {cancelButton}
      {editOrSaveButton}
    </div>
  )
}
