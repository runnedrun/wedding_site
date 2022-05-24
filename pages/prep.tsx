import React, { useState } from "react"
import type { NextPage } from "next"
import { Button } from "@/tailwind-components/application_ui/Button"
import { collection, getFirestore, deleteDoc, doc } from "firebase/firestore"
import { deleteUser } from "firebase/auth"
import { getAuth } from "@/data/getAuth"
import { prepRsvps } from "@/prep/prepRsvps"

const deleteCurrentUser = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    const id = user.uid
    await Promise.all([
      deleteDoc(doc(collection(getFirestore(), "privateUser"), id)),
      deleteDoc(doc(collection(getFirestore(), "publicUser"), id)),
    ])
    localStorage.clear()
    await deleteUser(user)
  } else {
    return Promise.resolve()
  }
}

const TriggerWithLoading = ({
  triggerFn,
  label,
}: {
  triggerFn: () => Promise<any>
  label: string
}) => {
  const [loading, setLoading] = useState(false)

  const runTriggerAndSetLoading = async () => {
    setLoading(true)
    await triggerFn()
    setLoading(false)
  }

  return (
    <Button
      onClick={runTriggerAndSetLoading}
      buttonAssets={{ text: loading ? "running..." : label }}
    ></Button>
  )
}

const Prep: NextPage = () => {
  return (
    <div>
      <div className="mb-5 mt-5">
        <TriggerWithLoading
          triggerFn={deleteCurrentUser}
          label="delete current user"
        ></TriggerWithLoading>
      </div>
      <div>
        <TriggerWithLoading
          triggerFn={prepRsvps}
          label="prep rsvp data"
        ></TriggerWithLoading>
      </div>
    </div>
  )
}

export default Prep
