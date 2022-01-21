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
      {newChangelogItems?.length > 0 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      )}
      {newChangelogItems?.length > 0 && (
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
