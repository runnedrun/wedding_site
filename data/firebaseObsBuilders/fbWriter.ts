import { objKeys } from "@/helpers/objKeys"
import { SingleArgObject } from "@/helpers/SingleArgObject"
import { clone } from "lodash"
import {
  BehaviorSubject,
  combineLatest,
  map,
  pairwise,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs"
import { ForeignKey } from "../baseTypes/ForeignKey"
import { Model } from "../baseTypes/Model"
import { buildParamaterizedObs } from "../builders/buildParamterizedObs"
import { obsToNamedParamObs } from "../builders/obsToNamedParamObs"
import { creators, setters } from "../fb"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { combine } from "../paramObsBuilders/combine"
import { ValueTypeFromParamObs } from "../paramObsBuilders/ParamObsTypeUtils"
import { staticValue } from "../paramObsBuilders/staticValue"
import { AllModels, CollectionModels } from "./CollectionModels"
import { docForKey } from "./docForKey"

type KeyError = {
  message: string
}

type ErrorType<DataType extends Record<string, any>> = {
  byKey?: Partial<Record<keyof DataType, KeyError>>
  overallError?: string
  hasError: boolean
}

type WriteResultsType<DataType extends Record<string, any>> = {
  errors: ErrorType<DataType>
  isEditing: boolean
}

type SetErrorFn<DataType extends Record<string, any>> = (
  keyName: keyof DataType,
  error: KeyError | string
) => void

type BeforeWrite<DataType extends Record<string, any>> = (args: {
  data: DataType
  baseData: DataType
  setError: SetErrorFn<DataType>
  errors: ErrorType<DataType>
}) => DataType

export enum EditingState {
  Editing,
  Saved,
  Cancelled,
}

const isKeyError = (
  errorOrString: string | KeyError
): errorOrString is KeyError => {
  return typeof errorOrString === "object"
}

export const fbWriter = <
  CollectionNameType extends keyof CollectionModels,
  BaseValueType extends CollectionModels[CollectionNameType],
  BaseValueParamObs extends ParamaterizedObservable<any, BaseValueType, any>
>(
  collectionName: CollectionNameType,
  baseValueObs: BaseValueParamObs,
  options: {
    beforeWrite?: BeforeWrite<BaseValueType>
    autoSave?: boolean
    onCreate?: (arg: {
      id: ForeignKey<CollectionNameType>
      clearEditingData: () => void
    }) => void
  } = {}
) => {
  const editinStateSubject = new BehaviorSubject(EditingState.Cancelled)
  const dataToWriteSubject = new BehaviorSubject({} as BaseValueType)

  const writeResultsObs = combineLatest([
    editinStateSubject,
    dataToWriteSubject,
  ]).pipe(
    startWith([undefined as EditingState, undefined as BaseValueType] as const),
    withLatestFrom(baseValueObs.pipe(startWith(undefined as BaseValueType))),
    map(([[editingState, dataToWrite], baseValue]) => {
      return [editingState, dataToWrite, baseValue as BaseValueType] as const
    }),
    pairwise(),
    map(([prev, current]) => {
      const prevState = prev[0]
      const currentState = current[0]
      const currentDataToWrite = current[1]

      const baseData = current[2] || ({} as BaseValueType)

      const updatedDataToWrite = { ...baseData, ...currentDataToWrite }

      const errors = { byKey: {} } as ErrorType<BaseValueType>

      const setError = (
        keyName: keyof BaseValueType,
        error: KeyError | string
      ) => {
        if (isKeyError(error)) {
          errors.byKey[keyName] = error
        } else {
          errors.byKey[keyName] = { message: error }
        }
      }

      const toWriteClone = clone(updatedDataToWrite)

      const beforeWrite = options.beforeWrite || (() => toWriteClone)

      const processedToWrite = beforeWrite({
        data: toWriteClone,
        baseData: baseData,
        setError,
        errors,
      })

      errors.hasError = !!errors.overallError || !!objKeys(errors.byKey).length

      const editingComplete =
        currentState === EditingState.Saved &&
        prevState === EditingState.Editing

      const timeToSave = editingComplete || options.autoSave

      return {
        errors: errors,
        data: processedToWrite,
        isEditing: currentState === EditingState.Editing,
        isCreate: !baseData,
        shouldWrite: !errors.hasError && !!processedToWrite && timeToSave,
      }
    }),
    tap(async (dataAndErrors) => {
      if (dataAndErrors.shouldWrite) {
        const uid = dataAndErrors.data.uid
        const cleanForWrite = { ...dataAndErrors.data }
        delete cleanForWrite["hydrated"]
        delete cleanForWrite["uid"]

        if (dataAndErrors.isCreate && options.onCreate) {
          const newDataRef = await creators[collectionName](
            cleanForWrite as any
          )
          dataToWriteSubject.next({
            ...dataToWriteSubject.getValue(),
            uid: newDataRef.id,
          })
          options.onCreate({
            id: newDataRef.id as ForeignKey<CollectionNameType>,
            clearEditingData: () => {
              dataToWriteSubject.next({} as BaseValueType)
            },
          })
        } else {
          setters[collectionName](uid, cleanForWrite as any)
        }
      }
    }),
    map((dataAndErrors) => {
      return {
        data: dataAndErrors.data,
        errors: dataAndErrors.errors,
        isEditing: dataAndErrors.isEditing,
      }
    })
  )

  const allDataAndWriteFunctionsObs = combine({
    baseValue: baseValueObs,
    writeResults: obsToNamedParamObs(writeResultsObs, "writeResults"),
    editingState: obsToNamedParamObs(editinStateSubject, "editingState"),
  }).pipe(
    map(({ baseValue, writeResults, editingState }) => {
      return {
        errors:
          writeResults.errors ||
          ({ hasError: false } as ErrorType<BaseValueType>),
        isEditing: writeResults.isEditing,
        baseData: baseValue,
        currentData: {
          ...baseValue,
          ...writeResults.data,
        } as ValueTypeFromParamObs<BaseValueParamObs>,
        editingState,
        setEditingState: (editingState: EditingState) => {
          editinStateSubject.next(editingState)
        },
        update(dataToWrite: Partial<BaseValueType>) {
          dataToWriteSubject.next({
            ...dataToWriteSubject.getValue(),
            ...dataToWrite,
          })
        },
        updateField(fieldName: keyof BaseValueType, value: any) {
          dataToWriteSubject.next({
            ...dataToWriteSubject.getValue(),
            [fieldName]: value,
          })
        },
      }
    })
  )

  return allDataAndWriteFunctionsObs
}
