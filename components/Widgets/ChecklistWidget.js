import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import ChecklistCheck from '../Icons/ChecklistCheck'
import { getActivityForChecklist } from '../../data/checklist'
import { getChecklistItems } from '../../data/checklist'
import { fetchHeightByTimestamp, useBlockHeight } from '../../data/blocks'
import ChecklistSkeleton from '../InfoBox/HotspotDetails/ChecklistSkeleton'
import ChecklistItems from '../InfoBox/HotspotDetails/ChecklistItems'
import client from '../../data/client'

const ChecklistWidget = ({ hotspot, witnesses, isDataOnly }) => {
  const [activity, setActivity] = useState({})
  const [loading, setActivityLoading] = useState(true)
  const [checklistFetched, setChecklistFetched] = useState(false)
  const [challengeInterval, setChallengeInterval] = useState(300)

  const { height } = useBlockHeight()

  useAsync(async () => {
    const hotspotid = hotspot.address

    if (!checklistFetched) {
      setActivityLoading(true)
      const hotspotActivity = await getActivityForChecklist(hotspotid)
      setActivity(hotspotActivity)
      const { pocChallengeInterval } = await client.vars.get()
      setChallengeInterval(pocChallengeInterval)
      setChecklistFetched(true)
      setActivityLoading(false)
    }
  }, [hotspot.address])

  const { result: syncHeight, loading: syncHeightLoading } =
    useAsync(async () => {
      const timestamp = hotspot?.status?.timestamp

      if (!timestamp) {
        return 1
      }

      const height = await fetchHeightByTimestamp(timestamp)
      return height
    }, [hotspot.status.timestamp])

  const possibleChecklistItems = useMemo(() => {
    return getChecklistItems(
      hotspot,
      witnesses,
      activity,
      height,
      syncHeight,
      loading || syncHeightLoading,
      isDataOnly,
      challengeInterval,
    )
  }, [
    activity,
    height,
    hotspot,
    loading,
    syncHeight,
    syncHeightLoading,
    witnesses,
    isDataOnly,
    challengeInterval,
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextMilestoneIndex, setNextMilestoneIndex] = useState(0)

  const [title, setTitle] = useState('')

  useEffect(() => {
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

  const sortChecklistItems = useCallback((checklistItems) => {
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
  }, [])

  useEffect(() => {
    if (!loading) {
      setProcessingChecklistItems(true)
      // get the furthest milestone that isn't completed yet
      let targetIndex = possibleChecklistItems.length - 1
      sortChecklistItems(possibleChecklistItems).find(
        (checklistItem, index) => {
          if (!checklistItem.completed) {
            targetIndex = index
            return checklistItem
          }
          return null
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
  }, [possibleChecklistItems, loading, sortChecklistItems])

  const [selectedChecklistItemInfo, setSelectedChecklistItemInfo] = useState({})

  useEffect(() => {
    setSelectedChecklistItemInfo(possibleChecklistItems[currentIndex])
  }, [currentIndex, possibleChecklistItems])

  if (processingChecklistItems) {
    return <ChecklistSkeleton />
  }

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
      <div className="flex items-center justify-start w-full">
        <p className="text-2xl font-medium text-black my-1.5 tracking-tight break-all m-0">
          {selectedChecklistItemInfo?.title}
        </p>
        {selectedChecklistItemInfo?.completed && (
          <ChecklistCheck className="ml-2" />
        )}
      </div>
      <ChecklistItems
        possibleChecklistItems={possibleChecklistItems}
        selectedChecklistItemInfo={selectedChecklistItemInfo}
        nextMilestoneIndex={nextMilestoneIndex}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  )
}
export default ChecklistWidget
