import { CollectionsWithConverters } from "@/data/firebaseObsBuilders/CollectionModels"
import { getAuth } from "@/data/getAuth"
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore"

export const clearAllData = () => {
  const auth = getAuth()
  const user = auth.currentUser
  const currentUserId = user?.uid
  return Promise.all(
    Object.keys(CollectionsWithConverters).map(async (collectionName) => {
      const querySnap = await getDocs(
        collection(getFirestore(), collectionName)
      )
      return querySnap.docs.map((doc) => {
        const isCurrentUser = doc.id === currentUserId
        return isCurrentUser ? Promise.resolve() : deleteDoc(doc.ref)
      })
    })
  )
}
