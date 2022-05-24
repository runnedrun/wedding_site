import { AllModels } from "@/data/firebaseObsBuilders/CollectionModels"
import { Model } from "@/data/baseTypes/Model"
import { getFirestore } from "firebase-admin/firestore"
import { Timestamp } from "firebase-admin/firestore"

const genExtraData = () => {
  return {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    archived: false,
  }
}

export const fbSet = (
  collectionName: keyof AllModels,
  docId: string,
  data: Partial<AllModels[keyof AllModels]>
) => {
  const firestore = getFirestore()

  return firestore
    .collection(collectionName)
    .doc(docId)
    .set(
      {
        updatedAt: Timestamp.now(),
        ...data,
      },
      { merge: true }
    )
}

export const fbCreate = async <Key extends keyof AllModels>(
  collectionName: Key,
  data: Omit<AllModels[Key], keyof Model<any, any>>
) => {
  const firestore = getFirestore()
  const ref = firestore.collection(collectionName).doc()
  await ref.set({
    ...genExtraData(),
    ...data,
  })
  return ref
}
