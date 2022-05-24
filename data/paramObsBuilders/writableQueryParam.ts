import { SingleArgObject } from "@/helpers/SingleArgObject"
import { map, shareReplay, tap } from "rxjs"
import { ParamaterizedObservable } from "../ParamaterizedObservable"
import { settable } from "./settable"
import Router from "next/router"
import { isServerside } from "@/helpers/isServerside"
import { WritableArg, writableSpecialArg } from "./writableSpecialArg"

const cachedObs = {} as Record<string, ParamaterizedObservable<any, any, any>>

let lastRouteWritePromise = Promise.resolve()

const writeToRoute = (newValue, name) => {
  lastRouteWritePromise = lastRouteWritePromise.then(() => {
    return new Promise((resolve) => {
      let currentQuery
      try {
        currentQuery = Router.query
      } catch (e) {
        resolve()
        return
      }

      const newQuery = { ...currentQuery } as any
      if (
        typeof newValue === "undefined" ||
        newValue === null ||
        newValue === ""
      ) {
        delete newQuery[name]
      } else {
        newQuery[name] = newValue
      }

      Router.events.on("routeChangeComplete", () => {
        resolve()
      })

      Router.replace(
        {
          query: newQuery,
        },
        undefined,
        { scroll: false }
      )
    })
  })
}

export const writableQueryParam = <
  ValueType extends any,
  NameType extends string
>(
  name: NameType,
  defaultValue: ValueType,
  processQueryValue: (query: string) => ValueType
): ParamaterizedObservable<
  SingleArgObject<NameType, WritableArg<ValueType>>,
  ValueType,
  any
> => {
  const processParam = (param) => {
    if (param === "" || typeof param === "undefined") {
      return defaultValue
    } else {
      return processQueryValue(param)
    }
  }

  const getValueFromQuery = (query) => {
    return processParam(query[name])
  }

  if (cachedObs[name]) {
    return cachedObs[name]
  }

  const writeParam = (newArg) => {
    const newValue = processParam(newArg)
    if (!isServerside()) {
      writeToRoute(newValue, name)
    }
  }

  const cachedObsForName = cachedObs[name]
  if (cachedObsForName) {
    return cachedObsForName
  }

  const settableObs = settable(
    name,
    writableSpecialArg(defaultValue, (_, context) =>
      getValueFromQuery(context.query)
    )
  ).pipe(
    tap((v) => {
      !v._isGenerated && writeParam(v._value)
    }),
    map((_) => _._value),
    shareReplay(1)
  )

  const obsForParam = settableObs

  cachedObs[name] = obsForParam
  return obsForParam
}
