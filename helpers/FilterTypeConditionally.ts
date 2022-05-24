export type FilterTypeConditionally<Source, Condition> = Pick<
  Source,
  { [K in keyof Source]: Source[K] extends Condition ? K : never }[keyof Source]
>

export type FilterTypeConditionallyByKey<Source, Condition> = Pick<
  Source,
  { [K in keyof Source]: K extends Condition ? K : never }[keyof Source]
>

export type OmitKeysConditionally<Source, Condition> = Pick<
  Source,
  { [K in keyof Source]: Source[K] extends Condition ? never : K }[keyof Source]
>

type U = OmitKeysConditionally<
  { a: 1; b: 2; c: { _readonly: true } },
  { _readonly: true }
>
