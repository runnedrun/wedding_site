import { hydrateTimestamps } from "@/data/fetchHelpers/jsonifyTimestamps"

export const buildInitialValuesFromReplay = (
  query: Record<string, string | string[]>
) => {
  const replayStateAndProps = query.sessionReplayData as string
  if (replayStateAndProps) {
    const {
      global: { state },
    } = hydrateTimestamps(JSON.parse(replayStateAndProps))
    return state
  }
  return {}
}
