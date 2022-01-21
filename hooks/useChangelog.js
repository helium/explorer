import { useState } from 'react'
import createPersistedState from 'use-persisted-state'

export const useChangelog = () => {
  const useChangelogState = createPersistedState('helium-explorer-changelog')

  const [changelogState, setChangelogState] = useChangelogState({})
  const [changelogShown, setChangelogShown] = useState(false)

  const hideChangelog = () => setChangelogShown(false)
  const showChangelog = () => setChangelogShown(true)

  const initializeChangelogItem = (changelogItemKey) => {
    const newState = changelogState || {}
    newState[changelogItemKey] = false
    try {
      // needs to be wrapped in a try/catch because of a weird bug with use-persisted-state:
      // https://github.com/donavon/use-persisted-state/issues/56#issuecomment-892877563
      setChangelogState(newState)
    } catch (e) {
      console.error(e)
    }
  }

  const setChangelogItemAsSeen = (changelogItemKey) => {
    const newState = changelogState || {}
    newState[changelogItemKey] = true
    try {
      // needs to be wrapped in a try/catch because of a weird bug with use-persisted-state:
      // https://github.com/donavon/use-persisted-state/issues/56#issuecomment-892877563
      setChangelogState(newState)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    changelogState,
    changelogShown,
    showChangelog,
    hideChangelog,
    initializeChangelogItem,
    setChangelogItemAsSeen,
  }
}
