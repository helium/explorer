import { useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { getActivityForChecklist } from '../../data/activity'
import { useAsync } from 'react-async-hook'
import ChevronIcon from '../Icons/Chevron'
import Skeleton from '../Common/Skeleton'
import ChecklistCheck from '../InfoBox/HotspotDetails/Checklist/ChecklistCheck'

const ChecklistWidget = ({ hotspot, witnesses, height }) => {
  const [activity, setActivity] = useState({})
  const [loading, setActivityLoading] = useState(true)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklistFetched, setChecklistFetched] = useState(false)

  const toggleShowChecklist = () =>
    setShowChecklist((currentSetting) => !currentSetting)

  useAsync(async () => {
    const hotspotid = hotspot.address

    if (showChecklist && !checklistFetched) {
      setActivityLoading(true)
      const hotspotActivity = await getActivityForChecklist(hotspotid)
      setActivity(hotspotActivity)
      setChecklistFetched(true)
      setActivityLoading(false)
    }
  }, [showChecklist, hotspot.address])

  const possibleChecklistItems = loading
    ? [{ sortOrder: 0 }]
    : [
        {
          sortOrder: 0,
          title: 'Blockchain Sync',
          infoTooltipText: `Hotspots must be fully synced before they can mine. New Hotspots can take up to 96 hours to sync.`,
          detailText:
            isNaN(hotspot.status.height) || isNaN(height)
              ? `Hotspot is not yet synced.`
              : height - hotspot.status.height < 500
              ? `Hotspot is fully synced.`
              : `Hotspot is ${(
                  height - hotspot.status.height
                ).toLocaleString()} block${
                  height - hotspot.status.height === 1 ? '' : 's'
                } behind the Helium blockchain and is roughly ${(
                  (hotspot.status.height / height) *
                  100
                )
                  .toFixed(2)
                  .toLocaleString()}% synced.`,
          completed: height - hotspot.status.height < 500,
        },
        {
          sortOrder: 1,
          title: 'Hotspot Status',
          infoTooltipText: 'Hotspots must be online to sync and mine.',
          detailText:
            hotspot.status.online === 'online' ? (
              `Hotspot is online.`
            ) : (
              <p>
                Hotspot is offline.{' '}
                <a
                  href="https://intercom.help/heliumnetwork/en/articles/3207912-troubleshooting-network-connection-issues"
                  target="_blank"
                  rel="noopener"
                  rel="noreferrer"
                >
                  Read our troubleshooting guide.
                </a>
              </p>
            ),
          completed: hotspot.status.online === 'online',
        },
        {
          sortOrder: 2,
          title: 'Create a Challenge',
          infoTooltipText:
            'Hotspots that are synced and online create a challenge automatically, every 480 blocks (~8 hours).',
          detailText:
            activity.challengerTxn !== null
              ? `Hotspot issued a challenge ${(
                  height - activity.challengerTxn.height
                ).toLocaleString()} block${
                  height - activity.challengerTxn.height === 1 ? '' : 's'
                } ago.`
              : `Hotspot hasn’t issued a challenge yet. Hotspots create challenges automatically every 480 blocks (~8 hours).`,
          completed: activity.challengerTxn !== null,
        },
        {
          sortOrder: 3,
          title: 'Witness a Challenge',
          detailText:
            activity.witnessTxn !== null
              ? // TODO: make this message more specific (e.g. add: "x blocks ago") once the API has been updated to make that number easier to get
                `Hotspot has witnessed a challenge recently.`
              : `Hotspot hasn't witnessed a challenge recently.`,
          infoTooltipText:
            'Hotspots that are synced and online automatically witness challenges if they’re in range of other Hotspots. If there are no Hotspots nearby, they will not be able to witness.',
          completed: activity.witnessTxn !== null,
        },
        {
          sortOrder: 4,
          title: 'Witnesses',
          detailText:
            witnesses?.length > 0
              ? `Hotspot has been witnessed by ${witnesses.length} Hotspot${
                  witnesses?.length === 1 ? '' : 's'
                }.`
              : `Hotspot has no witnesses.`,
          infoTooltipText:
            'The number of witnesses for a Hotspot is based on a rolling 5-day window and resets when a Hotspot location or antenna is updated.',
          completed: witnesses?.length > 0,
        },
        {
          sortOrder: 5,
          title: 'Participate in a Challenge',
          detailText:
            activity.challengeeTxn !== null
              ? `Hotspot last participated in a challenge ${(
                  height - activity.challengeeTxn.height
                ).toLocaleString()} block${
                  height - activity.challengeeTxn.height === 1 ? '' : 's'
                } ago.`
              : `Hotspot hasn’t participated in a challenge yet. Hotspots are challenged every 480 blocks.`,
          infoTooltipText:
            'Participation in a challenge depends on having witnesses. Use the checkbox to see Hotspots in your list. It can take a few days for challenges to include this Hotspot once a witness list is built.',
          completed: activity.challengeeTxn !== null,
        },
        {
          sortOrder: 6,
          title: 'Transferred Data',
          detailText:
            activity.dataTransferTxn !== null
              ? // TODO: make this message more specific (e.g. add "x blocks ago") once the API has been updated to make that number easier to get
                `Hotspot has transferred data packets recently.`
              : `Hotspot hasn’t transfered data packets recently.`,
          infoTooltipText:
            'Hotspots transfer encrypted data on behalf of devices using the network. Device usage is expanding, and it is normal to have a Hotspot that does not transfer data. This likely means there are no devices using the network in the area.',
          completed: activity.dataTransferTxn !== null,
        },
      ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextMilestoneIndex, setNextMilestoneIndex] = useState()

  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!nextMilestoneIndex) {
      setTitle('Loading')
    } else if (nextMilestoneIndex === -1) {
      setTitle('Completed Milestone')
    } else if (currentIndex === nextMilestoneIndex) {
      setTitle('Next Milestone')
    } else if (currentIndex > nextMilestoneIndex) {
      setTitle('Incomplete Milestone')
    } else {
      setTitle('Completed Milestone')
    }
  }, [currentIndex, nextMilestoneIndex])

  useEffect(() => {
    if (showChecklist && !loading) {
      // show the furthest item that isn't completed yet
      let targetIndex = possibleChecklistItems.length - 1
      sortChecklistItems(possibleChecklistItems).find(
        (checklistItem, index) => {
          if (!checklistItem.completed) {
            targetIndex = index
            return checklistItem
          }
        },
      )
      setCurrentIndex(targetIndex)
      if (
        targetIndex === possibleChecklistItems.length - 1 &&
        possibleChecklistItems[targetIndex].completed
      ) {
        // all milestones are completed
        setNextMilestoneIndex(-1)
      } else {
        setNextMilestoneIndex(targetIndex)
      }
      setCurrentIndex(targetIndex)
    }
  }, [showChecklist, loading])

  const [selectedChecklistItemInfo, setSelectedChecklistItemInfo] = useState({})

  useEffect(() => {
    setSelectedChecklistItemInfo(possibleChecklistItems[currentIndex])
  }, [currentIndex])

  const sortChecklistItems = (checklistItems) => {
    const unsortedChecklistItems = checklistItems
    const sortedChecklistItems = unsortedChecklistItems.sort((a, b) => {
      if (b.completed || a.completed) {
        // if one of the items is complete, sort it first
        return b.completed - a.completed
      } else {
        // otherwise, sort them by their "sortOrder field"
        return a.sortOrder < b.sortOrder
          ? -1
          : a.sortOrder > b.sortOrder
          ? 1
          : 0
      }
    })

    return sortedChecklistItems
  }

  const sliceWidth = `${(1 / possibleChecklistItems.length) * 100}%`

  if (!showChecklist) {
    return (
      <div
        className="bg-gray-200 p-3 rounded-lg col-span-2 cursor-pointer hover:bg-gray-300"
        onClick={toggleShowChecklist}
      >
        <div
          className={classNames(
            'flex items-center justify-between',
            'text-gray-600 mx-auto text-md px-4 py-3',
          )}
        >
          Load checklist
          <ChevronIcon
            className={classNames(
              'h-4 w-4',
              'ml-1',
              'transform duration-500 transition-all',
              { 'rotate-180': !showChecklist },
            )}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
      <div className="flex items-center justify-start w-full">
        <p className="text-2xl font-medium text-black my-1.5 tracking-tight break-all m-0">
          {selectedChecklistItemInfo.title}
        </p>
        {selectedChecklistItemInfo.completed && (
          <ChecklistCheck className="ml-2" />
        )}
      </div>
      <div className="flex items-center justify-center h-10 md:h-5">
        {sortChecklistItems(possibleChecklistItems).map(
          (checklistItem, index, { length }) => {
            const isNextMilestone =
              index === nextMilestoneIndex && nextMilestoneIndex !== -1
            const isCompleted = checklistItem.completed
            const isSelected = index === currentIndex

            return (
              <Tooltip key={checklistItem.title} title={checklistItem.title}>
                <div
                  onClick={() => setCurrentIndex(index)}
                  className={classNames(
                    'h-8 md:h-4 p-2 cursor-pointer border-solid border-l border-gray-200',
                    {
                      'bg-navy-400': isCompleted && !isSelected,
                      'bg-navy-300': isCompleted && isSelected,
                      'animate-pulse opacity-25 bg-navy-400': isNextMilestone,
                      'bg-gray-300':
                        !isCompleted && !isNextMilestone && !isSelected,
                      'bg-gray-350':
                        !isCompleted && !isNextMilestone && isSelected,
                      'rounded-l-md': index === 0,
                      'rounded-r-md': index + 1 === length,
                    },
                  )}
                  style={{
                    width: sliceWidth,
                  }}
                />
              </Tooltip>
            )
          },
        )}
      </div>
      <p className="text-md font-sans text-black pt-2 m-0">
        {selectedChecklistItemInfo.detailText}
      </p>
      <p className="text-xs font-sans text-gray-600 pt-2 m-0">
        {selectedChecklistItemInfo.infoTooltipText}
      </p>
    </div>
  )
}
export default ChecklistWidget
