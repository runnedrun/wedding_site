import { Model } from "@/data/baseTypes/Model"

export const docListToMap = <ModelType extends Model<any, any>[]>(
  list: ModelType
): Record<string, ModelType[any]> => {
  const map = {}
  list.forEach((doc) => {
    map[doc.uid] = doc
  })
  return map
}
