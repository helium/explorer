import { useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import ChevronIcon from '../Icons/Chevron'
import ChecklistCheck from '../Icons/ChecklistCheck'
import { getActivityForChecklist } from '../../data/checklist'
import { getChecklistItems } from '../../data/checklist'
import { useBlockHeight } from '../../data/blocks'
import useToggle from '../../utils/useToggle'
import ChecklistSkeleton from '../InfoBox/HotspotDetails/ChecklistSkeleton'

const ChecklistWidget = ({ hotspot, witnesses }) => {
  const [activity, setActivity] = useState({})
  const [loading, setActivityLoading] = useState(true)
  const [showChecklist, toggleShowChecklist] = useToggle()
  const [checklistFetched, setChecklistFetched] = useState(false)

  const { height } = useBlockHeight()

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

  const possibleChecklistItems = getChecklistItems(
    hotspot,
    witnesses,
    activity,
    height,
    loading,
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextMilestoneIndex, setNextMilestoneIndex] = useState()

  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!nextMilestoneIndex) return

    if (nextMilestoneIndex === -1) {
      setTitle('Completed Milestone')
    } else if (currentIndex === nextMilestoneIndex) {
      setTitle('Next Milestone')
    } else if (currentIndex > nextMilestoneIndex) {
      setTitle('Incomplete Milestone')
    } else {
      setTitle('Completed Milestone')
    }
  }, [currentIndex, nextMilestoneIndex])

  const [processingChecklistItems, setProcessingChecklistItems] = useState(true)

  useEffect(() => {
    if (showChecklist && !loading) {
      setProcessingChecklistItems(true)
      // get the furthest milestone that isn't completed yet
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
      setProcessingChecklistItems(false)
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

  if (processingChecklistItems) {
    return <ChecklistSkeleton />
  }

  const sliceWidth = `${(1 / possibleChecklistItems.length) * 100}%`

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
              <Tooltip
                key={checklistItem.title}
                placement={'bottom'}
                title={checklistItem.title}
              >
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
