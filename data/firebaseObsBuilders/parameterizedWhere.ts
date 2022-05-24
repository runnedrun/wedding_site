import { buildParamaterizedObs } from "@/data/builders/buildParamterizedObs"
import { buildObsForCollection } from "@/data/builders/buildObsForCollection"
import { buildObsWhereEqual } from "@/data/builders/buildObsWhereEqual"
import { CollectionModels } from "@/data/firebaseObsBuilders/CollectionModels"
import { objKeys } from "@/helpers/objKeys"
import { getObsForChild } from "../builders/getObsForChild"

export const parameterizedWhere = <
  CollectionName extends keyof CollectionModels,
  PossibleKeys extends keyof CollectionModels[CollectionName] & string
>(
  collectionName: CollectionName,
  ...keys: PossibleKeys[]
) => {
  const forText = keys.join("And")
  const name = `${collectionName}For${forText}` as const
  const startingArgs = {} as {
    [key in PossibleKeys]: string | undefined | boolean
  }
  keys.forEach((keyName) => {
    startingArgs[keyName] = undefined
  })

  return buildParamaterizedObs(name, startingArgs, (results) => {
    return buildObsForCollection(
      collectionName,
      objKeys(startingArgs).map((key) => {
        return buildObsWhereEqual(String(key), getObsForChild(results, key))
      })
    )
  })
}
