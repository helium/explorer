import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { changelogContent } from './changelog-content'
import ChangelogContext from './ChangelogContext'

const ChangelogButton = ({ className }) => {
  const {
    showChangelog,
    changelogState,
    setChangelogItemAsSeen,
    initializeChangelogItem,
  } = useContext(ChangelogContext)

  const [newChangelogItems, setNewChangelogItems] = useState([])

  useEffect(() => {
    const changelogKeys = Object.keys(changelogContent)

    if (changelogKeys?.length > 0) {
      changelogKeys.forEach((changelogKey) => {
        // initialize all keys in changelogContent in state in case the user hasn't seen them yet
        if (
          // is an active key in changelogContent JSON
          changelogContent[changelogKey]?.active &&
          // and it doesn't exist yet in the state (user hasn't been here yet)
          !changelogState?.hasOwnProperty(changelogKey)
        ) {
          initializeChangelogItem(changelogKey)
        }

        // build a list of new changelog items that the user hasn't seen yet
        // to mark them all as "seen" when the bell icon is opened
        if (
          changelogContent[changelogKey]?.active &&
          changelogState?.hasOwnProperty(changelogKey) &&
          changelogState[changelogKey] === false
        ) {
          const newItems = []
          newItems.push(changelogKey)
          setNewChangelogItems(newItems)
        }
      })
    }
  }, [changelogState, initializeChangelogItem])

  return (
    <div
      className={classNames(
        className,
        'duration-200 transition-all text-gray-400 hover:text-white cursor-pointer relative pt-0.5',
      )}
      onClick={showChangelog}
    >
      <NotificationIcon hasNewNotifications={newChangelogItems} />
        <div
          className={'absolute z-50 cursor-pointer -top-1 -right-1'}
          onClick={() => {
            newChangelogItems.forEach((changelogItemKey) => {
              setChangelogItemAsSeen(changelogItemKey)
              setNewChangelogItems([])
            })
          }}
        >
          <div className="w-3 h-3">
            <div className="animate-ping absolute top-0.5 right-0 inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <div
              className={classNames(
                'w-3 h-3',
                'relative inline-flex rounded-full bg-red-400',
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangelogButton
