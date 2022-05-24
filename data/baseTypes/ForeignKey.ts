import { ValuesType } from "utility-types"
import {
  AllModels,
  CollectionModels,
} from "../firebaseObsBuilders/CollectionModels"

export type ForeignKey<
  DestinationCollectionName extends keyof CollectionModels
> = string & { _dest: DestinationCollectionName }

export type ForeignKeys<
  DestinationCollectionName extends keyof CollectionModels
> = string[] & { _dest: DestinationCollectionName }

export type ForeignKeyOrKeys = ForeignKey<any> | ForeignKeys<any>

export type ExpandForeignKeys<
  Object extends Record<string, any>,
  Path extends string = "",
  I extends number = 3
> = [I] extends [never]
  ? never
  : {
      [key in Extract<
        keyof Omit<Object, "uid">,
        string
      > as Object[key] extends ForeignKey<any>
        ? key
        : Object[key] extends ForeignKeys<any>
        ? key
        : never]: Object[key] extends ForeignKey<any>
        ? ForeignKeyDataMap<Object[key], Path, key, I>
        : Object[key] extends ForeignKeys<any>
        ? ForeignKeyDataMap<Object[key], Path, key, I>
        : never
    }

export type ForeignKeyDataMap<
  Key extends ForeignKey<any> | ForeignKeys<any>,
  Path extends string,
  NewKey extends string,
  I extends number
> = {
  _nested: ExpandForeignKeys<GetForeignKeyModel<Key>, `${Path}${NewKey}.`, I>
} & ForeignKeyData<
  GetForeignKeyOrKeysCollection<Key>,
  GetForeignKeyModel<Key>,
  GetForeignKeyReferenceType<Key>,
  `${Path}${NewKey}`
>

type ForeignKeyData<
  CollectionName extends string,
  Model extends Object,
  ReferenceType extends Object,
  Path extends string
> = {
  _collectionName: CollectionName
  _model: Model
  _referenceType: ReferenceType
  _path: Path
}

type AllForeignKeyData1<Obj extends Record<string, any>> = ValuesType<
  ExpandForeignKeys<Obj>
>

type AllForeignKeyData2<Obj extends Record<string, any>> = ValuesType<
  ValuesType<ExpandForeignKeys<Obj>>["_nested"]
>

type AllForeignKeyData3<Obj extends Record<string, any>> = ValuesType<
  ValuesType<ValuesType<ExpandForeignKeys<Obj>>["_nested"]>["_nested"]
>

type AllForeignKeyData4<Obj extends Record<string, any>> = ValuesType<
  ValuesType<
    ValuesType<ValuesType<ExpandForeignKeys<Obj>>["_nested"]>["_nested"]
  >["_nested"]
>

type AllForeignKeyData<Obj extends Record<string, any>> =
  | AllForeignKeyData1<Obj>
  | AllForeignKeyData2<Obj>
  | AllForeignKeyData3<Obj>
  | AllForeignKeyData4<Obj>

export type PathMapToForeignKeyData<Object extends Record<string, any>> = {
  [Data in AllForeignKeyData<Object> as Data["_path"] extends string
    ? Data["_path"]
    : never]: ForeignKeyData<
    Data["_collectionName"],
    Data["_model"],
    Data["_referenceType"],
    Data["_path"]
  >
}

type PathMapTo<
  Object extends Record<string, any>,
  DataKey extends keyof ForeignKeyData<any, any, any, any>
> = {
  [Data in AllForeignKeyData<Object> as Data["_path"] extends string
    ? Data["_path"]
    : never]: Data[DataKey]
}

export type AllForeignKeyPaths<
  Obj extends Record<string, any>
> = keyof PathMapToCollectionName<Obj>

export type PathMapToCollectionName<
  Obj extends Record<string, any>
> = PathMapTo<Obj, "_collectionName">

export type PathMapToReference<Obj extends Record<string, any>> = PathMapTo<
  Obj,
  "_referenceType"
>

export type PathMapToModel<Obj extends Record<string, any>> = PathMapTo<
  Obj,
  "_model"
>

export type GetForeignKeyCollection<
  T extends ForeignKey<any>
> = T extends ForeignKey<infer Collection> ? Collection : never

export type GetForeignKeysCollection<
  T extends ForeignKeys<any>
> = T extends ForeignKeys<infer Collection> ? Collection : never

export type GetForeignKeyOrKeysCollection<
  T extends ForeignKeys<any> | ForeignKey<any>
> = T extends ForeignKeys<any>
  ? GetForeignKeysCollection<T>
  : T extends ForeignKey<any>
  ? GetForeignKeyCollection<T>
  : never

export type GetForeignKeyModel<
  Key extends ForeignKey<any> | ForeignKeys<any>
> = AllModels[GetForeignKeyOrKeysCollection<Key>]

export type GetForeignKeyReferenceType<
  Key extends ForeignKey<any> | ForeignKeys<any>
> = Key extends ForeignKey<any>
  ? AllModels[GetForeignKeyOrKeysCollection<Key>]
  : Key extends ForeignKeys<any>
  ? AllModels[GetForeignKeyOrKeysCollection<Key>][]
  : never
