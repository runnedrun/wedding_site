import { isUndefined } from "lodash"
import { paginatedMapper } from "./helpers/paginatedMapper"

export const exampleMigration = async (options: Record<string, any>) => {
  await paginatedMapper(
    "publicUser",
    (snap) => {
      const doc = snap.data()
      if (isUndefined(doc.nickname)) {
        return { nickname: "example nickname" }
      }
      return undefined
    },
    options
  )

  console.log("transform complete")
}
