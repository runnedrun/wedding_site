import { combineLatest, Observable, of, switchMap } from "rxjs"
import { ForeignKey } from "../baseTypes/ForeignKey"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import {
  ArgsTypeFromParamObs,
  NameTypeFromParamObs,
} from "../paramObsBuilders/ParamObsTypeUtils"
import { CollectionModels } from "./CollectionModels"
import { doc } from "./doc"

export const docsForKeys = <
  CollectionName extends keyof CollectionModels,
  KeyParamObs extends ParamaterizedObservable<any, string[], any>
>(
  collectionName: CollectionName,
  keys: KeyParamObs
): ParamaterizedObservable<
  ArgsTypeFromParamObs<KeyParamObs>,
  CollectionModels[CollectionName][],
  NameTypeFromParamObs<KeyParamObs>
> => {
  return keys.pipe(
    switchMap((_) => {
      return _.length
        ? combineLatest(
            _.map((key) => {
              return doc(collectionName).attach({
                key: key as ForeignKey<CollectionName>,
              })
            })
          )
        : of([])
    })
  )
}
