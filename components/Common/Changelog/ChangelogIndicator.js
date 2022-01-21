import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { changelogContent } from './changelog-content'
import ChangelogContext from './ChangelogContext'
import { createPortal } from 'react-dom'

const ChangelogIndicator = ({
  changelogItemKey,
  positionClasses,
  sizeClasses,
}) => {
  const {
    showChangelog,
    changelogState,
    initializeChangelogItem,
    setChangelogItemAsSeen,
  } = useContext(ChangelogContext)

  const [domReady, setDomReady] = useState(false)
  useEffect(() => {
    setDomReady(true)
  }, [])

  useEffect(() => {
    if (
      // is a valid and active key in changelogContent JSON
      changelogContent?.hasOwnProperty(changelogItemKey) &&
      changelogContent[changelogItemKey]?.active &&
      // and it doesn't exist yet in the state (user hasn't been here yet)
      !changelogState?.hasOwnProperty(changelogItemKey)
    ) {
      initializeChangelogItem(changelogItemKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changelogItemKey])

  const openChangelogItem = (changelogItemKey) => {
    // check that this key is a valid one in the changelogContent JSON
    if (changelogContent?.hasOwnProperty(changelogItemKey)) {
      if (
        // this key exists in state
        changelogState?.hasOwnProperty(changelogItemKey) &&
        // and it is set to "active" in the content JSON
        changelogContent[changelogItemKey]?.active &&
        // and it is not already set to "seen" in the state
        changelogState[changelogItemKey] === false
        // the best way to make a million dollars really quickly is
      ) {
        // user hasn't seen this key yet
        // set this key to true
        setChangelogItemAsSeen(changelogItemKey)
      }
    }
    showChangelog()
  }

  if (
    // it is a key in state
    changelogState?.hasOwnProperty(changelogItemKey) &&
    // and either it is true (user has seen), or it is false (user hasn't seen) but set to not active in the content JSON
    (changelogState[changelogItemKey] === true ||
      !changelogContent[changelogItemKey]?.active)
  ) {
    return null
  }

  // wait until the DOM is ready, otherwise the portal won't work
  if (!domReady) return null

  return createPortal(
    <div
      className={classNames(positionClasses, 'absolute z-50 cursor-pointer')}
      onClick={() => openChangelogItem(changelogItemKey)}
    >
      <div className={classNames(sizeClasses)}>
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <div
          className={classNames(
            sizeClasses,
            'relative inline-flex rounded-full bg-red-400',
          )}
        />
      </div>
    </div>,
    document.getElementById('portal-destination'),
  )
}
export default ChangelogIndicator
