import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { filtered, ModelFilter } from "../paramObsBuilders/filtered"
import { UnionOfArgs } from "../paramObsBuilders/ParamObsTypeUtils"
import { settable } from "../paramObsBuilders/settable"
import { staticValue } from "../paramObsBuilders/staticValue"
import { CollectionModels } from "./CollectionModels"

export const nonArchived = <
  CollectionName extends keyof CollectionModels,
  FilterType extends ModelFilter<CollectionModels[CollectionName]> = {}
>(
  collectionName: CollectionName,
  filters?: FilterType
) => {
  const filterObj = (typeof filters === "undefined"
    ? {}
    : filters) as FilterType

  const archivedFilter = { archived: staticValue(false) }
  const allFilters = {
    ...archivedFilter,
    ...filterObj,
  } as FilterType
  // const allFilters = { archived: staticValue(false) } as FilterType
  const u = filtered(collectionName, allFilters)
  return u
}
