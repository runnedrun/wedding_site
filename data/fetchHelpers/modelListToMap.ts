import { Model } from "../baseTypes/Model"

export const modelListToMap = <ModelType extends Model<any, any>>(
  items: ModelType[]
) => {
  const correctItems = (items || []) as ModelType[]
  const mapping = {} as {
    [key: string]: ModelType
  }
  correctItems.forEach((item: Model<any, any>) => {
    if (item) {
      mapping[item.uid] = item
    }
  })
  return mapping
}
