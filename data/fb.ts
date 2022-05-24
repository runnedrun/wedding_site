import {
  doc,
  DocumentReference,
  FirestoreDataConverter,
  setDoc,
  collection,
  Timestamp,
} from "@firebase/firestore"
import {
  CollectionModels,
  AllModels,
  CollectionsWithConverters,
} from "./firebaseObsBuilders/CollectionModels"
import { User } from "./types/User"
import { PublicUser, PublicUserKeys } from "./types/PublicUser"
import { PrivateUser } from "./types/PrivateUser"
import { objKeys } from "@/helpers/objKeys"
import { init, initMetaFb } from "./initFb"

const refFunctions = {} as {
  [key in keyof CollectionModels]: (id?: string) => DocumentReference
}

const setterFunctions = {} as {
  [key in keyof AllModels]: (
    id: string,
    newData: Partial<AllModels[key]>
  ) => Promise<void>
}

type CreatorFunction<Key extends keyof AllModels> = (
  newData: Omit<AllModels[Key], "uid">
) => Promise<DocumentReference<AllModels[Key]>>

const creatorFunctions = {} as {
  [key in keyof CollectionModels | "user"]: CreatorFunction<key>
}

const extractPublicAndPrivateObjects = (user: Partial<User>) => {
  const publicUserObj = {} as PublicUser
  const privateUserObj = {} as PrivateUser
  objKeys(user).forEach((key) => {
    const value = user[key]
    if (PublicUserKeys.includes(key as keyof PublicUser)) {
      publicUserObj[key] = value
    } else {
      privateUserObj[key] = value
    }
  })
  return { publicUserObj, privateUserObj }
}

creatorFunctions.user = (user: Partial<User>) => {
  const { publicUserObj, privateUserObj } = extractPublicAndPrivateObjects(user)
  const userId = refFunctions.privateUser().id
  return Promise.all([
    setterFunctions["privateUser"](userId, privateUserObj),
    setterFunctions["publicUser"](userId, publicUserObj),
  ]).then(() => {
    return refFunctions.privateUser(userId) as DocumentReference<User>
  })
}

setterFunctions.user = (id: string, user: Partial<User>) => {
  const { publicUserObj, privateUserObj } = extractPublicAndPrivateObjects(user)
  return Promise.all([
    setterFunctions["privateUser"](id, privateUserObj),
    setterFunctions["publicUser"](id, publicUserObj),
  ]).then(() => {})
}

Object.keys(CollectionsWithConverters).forEach(
  (collectionNameString: string) => {
    const collectionName = collectionNameString as keyof CollectionModels
    const converter = CollectionsWithConverters[
      collectionName
    ] as FirestoreDataConverter<CollectionModels[typeof collectionName]>

    const refFunction = (docId?: string) => {
      const firestore = collectionNameString.startsWith("dev_")
        ? initMetaFb()
        : init()

      const newOrExistingDoc = docId
        ? doc(collection(firestore, collectionName), docId)
        : doc(collection(firestore, collectionName))

      return newOrExistingDoc.withConverter(converter)
    }

    const filterUndefinedValuesAndUid = (object: { [key: string]: any }) => {
      const keys = Object.keys(object) as (keyof typeof object)[]
      return keys
        .filter((key) => {
          const value = object[key]
          return typeof value !== "undefined" && key !== "uid"
        })
        .reduce((builder, key) => {
          builder[key] = object[key]
          return builder
        }, {} as typeof object)
    }

    refFunctions[collectionName] = refFunction

    setterFunctions[collectionName] = (
      docId: string,
      newData: Partial<CollectionModels[typeof collectionName]>
    ) => {
      const undefFiltered = filterUndefinedValuesAndUid(newData)
      delete undefFiltered["hydrated"]
      delete undefFiltered["uid"]

      const withUpdatedAt = {
        ...undefFiltered,
        updatedAt: Timestamp.now(),
      }

      const done = setDoc(refFunction(docId), withUpdatedAt, {
        merge: true,
      })
      return done
    }

    const creatorFunction = (
      initData: Omit<CollectionModels[typeof collectionName], "uid">
    ) => {
      const undefFiltered = filterUndefinedValuesAndUid(initData)
      const withArchivedFalse = {
        ...undefFiltered,
        archived: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      const ref = refFunction()
      return setDoc(ref, withArchivedFalse, {
        merge: true,
      }).then((_) => ref)
    }

    creatorFunctions[collectionName] = creatorFunction as any
  }
)

export const fb = refFunctions
export const setters = setterFunctions
export const creators = creatorFunctions
