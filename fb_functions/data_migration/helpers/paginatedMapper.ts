import { AllModels } from "@/data/firebaseObsBuilders/CollectionModels"
import {
  getFirestore,
  QueryDocumentSnapshot,
  FieldPath,
} from "firebase-admin/firestore"

interface Options {
  dry?: boolean
}

export const paginatedMapper = async <CollectionName extends keyof AllModels>(
  collectionName: CollectionName,
  eachDoc: (
    snap: QueryDocumentSnapshot<AllModels[CollectionName]>
  ) => Partial<AllModels[CollectionName]>,
  options?: Options
) => {
  const opts = options || {}
  const dry = opts["--dry"]
  const probe = opts["--probe"]
  console.log("dry?", dry)

  const firestore = getFirestore()
  const collection = firestore.collection(collectionName)
  let writer = firestore.batch()
  let writeCount = 0

  const firstDocQuerySnap = await collection
    .limit(1)
    .orderBy(FieldPath.documentId())
    .get()
  const firstDoc = firstDocQuerySnap.docs[0]
  if (probe) {
    console.log(`Probe results (${collectionName}):`, firstDoc?.data())
    return
  }
  if (!firstDoc) {
    console.log("no documents in", collectionName)
    return
  }
  let cursor = firstDoc

  while (true) {
    const querySnaps = await collection
      .limit(400)
      .orderBy(FieldPath.documentId())
      .startAfter(cursor)
      .get()

    const docs =
      writeCount === 0 ? [firstDoc].concat(querySnaps.docs) : querySnaps.docs

    for (let i = 0; i < docs.length; i++) {
      const querySnap = docs[i]
      const update = eachDoc(
        querySnap as QueryDocumentSnapshot<AllModels[CollectionName]>
      )

      if (update && Object.keys(update).length > 0) {
        if (dry) {
          console.log("would write", i, querySnap.id, update)
        }
        !dry && writer.update(querySnap.ref, update)
        writeCount++
        if (writeCount % 400 === 0) {
          !dry && (await writer.commit())
          console.log("writing batch")
          writer = firestore.batch()
        }
      }
    }

    if (querySnaps.docs.length < 400) {
      break
    } else {
      cursor = querySnaps.docs[querySnaps.docs.length - 1]
    }
  }

  console.log(writeCount, "writes complete")

  !dry && (await writer.commit())
}
