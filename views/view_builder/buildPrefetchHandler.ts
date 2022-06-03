import { jsonifyTimestamps } from "@/data/fetchHelpers/jsonifyTimestamps"
import { removeFunctionsFromObj } from "@/data/fetchHelpers/removeFunctions"
import { RecordParamObs } from "@/data/paramObsBuilders/ParamObsTypeUtils"
import { Redirect } from "next"
import { SSRPropsContext } from "next-firebase-auth"
import { buildInitialValuesFromReplay } from "./buildInitialValuesFromReplay"
import { InputsAndValuesFromParamObs } from "./getInputsAndValuesFromParamObs"
import { possiblyHandleWarmupRequest } from "./possiblyHandleWarmupRequest"
import { processSpecialArgs } from "./processSpecialArgs"

export type RequestContext = {
  host: string
}

export type PrefetchFnType<ParamObsType extends RecordParamObs> = (
  ctx: SSRPropsContext
) => Promise<
  | {
      props: {
        prefetch: InputsAndValuesFromParamObs<ParamObsType>
        context: RequestContext
      }
    }
  | {
      redirect: Redirect
    }
>

export const buildPrefetchHandler = <ParamObsType extends RecordParamObs>(
  paramObsFb: () => ParamObsType
): PrefetchFnType<ParamObsType> => {
  return async (context) => {
    const paramObs = paramObsFb()

    if (await possiblyHandleWarmupRequest(context.query)) {
      return {
        redirect: {
          destination: "/_warmup",
          permanent: false,
        },
      }
    }

    const initialValuesFromReplay = buildInitialValuesFromReplay(context.query)

    const processedArgs = processSpecialArgs(paramObs.originalArgs, {
      query: context.query,
      props: {},
      triggeredByContextUpdate: true,
    })

    const allData = await paramObs.getWithArgs({
      ...processedArgs,
      ...initialValuesFromReplay,
    })

    const timestampsJsonified = jsonifyTimestamps(allData)
    const fnsRemoved = removeFunctionsFromObj(timestampsJsonified)
    return {
      props: {
        prefetch: fnsRemoved as InputsAndValuesFromParamObs<ParamObsType>,
        context: {
          host: context.req.headers.host as string,
        },
      },
    }
  }
}
