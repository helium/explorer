import { useState, useEffect } from 'react'
import ChecklistCard from './ChecklistCard'
import { Tooltip } from 'antd'

const HotspotChecklist = ({ hotspot, witnesses, activity }) => {
  const possibleChecklistItems = [
    {
      sortOrder: 0,
      title: 'Blockchain Sync',
      infoTooltipText: `Hotspots must be fully synced before they can mine. New Hotspots can take up to 48 hours to sync.`,
      detailText:
        isNaN(hotspot.status.height) || isNaN(hotspot.block)
          ? `Hotspot is not yet synced.`
          : hotspot.block - hotspot.status.height < 100
          ? `Hotspot is fully synced.`
          : `Hotspot is ${(
              hotspot.block - hotspot.status.height
            ).toLocaleString()} block${
              hotspot.block - hotspot.status.height === 1 ? '' : 's'
            } behind the Helium blockchain and is roughly ${(
              (hotspot.status.height / hotspot.block) *
              100
            )
              .toFixed(2)
              .toLocaleString()}% synced.`,
      condition: hotspot.block - hotspot.status.height < 100,
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
      condition: hotspot.status.online === 'online',
    },
    {
      sortOrder: 2,
      title: 'Create a Challenge',
      infoTooltipText:
        'Hotspots that are synced and online create a challenge automatically, every 60 blocks.',
      detailText:
        activity.challengerTxn !== null
          ? `Hotspot issued a challenge ${(
              hotspot.block - activity.challengerTxn.height
            ).toLocaleString()} block${
              hotspot.block - activity.challengerTxn.height === 1 ? '' : 's'
            } ago.`
          : `Hotspot hasn’t issued a challenge yet. Hotspots create challenges automatically.`,
      condition: activity.challengerTxn !== null,
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
      condition: activity.witnessTxn !== null,
    },
    {
      sortOrder: 4,
      title: 'Witness List',
      detailText:
        witnesses.length > 0
          ? `Hotspot has ${witnesses.length} Hotspot${
              witnesses.length === 1 ? '' : 's'
            } in its witness list.`
          : `Hotspot doesn't currently have a witness list.`,
      infoTooltipText:
        'A Hotspot’s witness list is populated the more challenges it witnesses. Witness Lists refresh periodically to exclude offline Hotspots.',
      condition: witnesses.length > 0,
    },
    {
      sortOrder: 5,
      title: 'Participate in a Challenge',
      detailText:
        activity.challengeeTxn !== null
          ? `Hotspot last participated in a challenge ${(
              hotspot.block - activity.challengeeTxn.height
            ).toLocaleString()} block${
              hotspot.block - activity.challengeeTxn.height === 1 ? '' : 's'
            } ago.`
          : `Hotspot hasn’t participated in a challenge yet.`,
      infoTooltipText:
        'Participation in a challenge depends on having a witness list. Use the checkbox to see Hotspots in your list. It can take a few hours for challenges to include this Hotspot once a witness list is built.',
      condition: activity.challengeeTxn !== null,
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
        'Hotspots transfer encryped data on behalf of devices using the network. Device usage is expanding, and it is normal to have a Hotspot that does not transfer data. This likely means there are no devices using the network in the area.',
      condition: activity.dataTransferTxn !== null,
    },
  ]

  const CARD_WIDTH = 218
  const CARD_MARGIN = 20

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0)
  const [outerContainerWidth, setOuterContainerWidth] = useState(850)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(
    possibleChecklistItems.length * (CARD_WIDTH + CARD_MARGIN) + CARD_MARGIN,
  )
  const [hideNextButton, setHideNextButton] = useState(false)

  useEffect(() => {
    // Scroll to the furthest card that isn't completed yet 1 second after the page loads
    let targetIndex = 0
    sortChecklistItems(possibleChecklistItems).find((checklistItem, index) => {
      if (!checklistItem.condition) {
        targetIndex = index
        return checklistItem
      }
    })

    if (targetIndex !== 0) {
      setTimeout(() => {
        scrollToIndex(targetIndex)
      }, 500)
    }
    handleScroll()
  }, [])

  useEffect(() => {
    handleScroll()
    updateScrollAndWindowSizes()
  })

  const updateScrollAndWindowSizes = () => {
    // Refresh the values
    const currentScrollPosition = document.getElementById(
      'hotspot-checklist-container',
    ).scrollLeft
    setCurrentScrollPosition(currentScrollPosition)
    const scrollContainerWidth = document.getElementById(
      'hotspot-checklist-container',
    ).scrollWidth
    setScrollContainerWidth(scrollContainerWidth)
    const outerContainerWidth = document.getElementById(
      'hotspot-checklist-outer-container',
    ).clientWidth
    setOuterContainerWidth(outerContainerWidth)
  }

  const handleScroll = () => {
    updateScrollAndWindowSizes()

    let index = 0

    if (
      currentScrollPosition < CARD_MARGIN ||
      currentScrollPosition <
        outerContainerWidth / 2 - (CARD_WIDTH + CARD_MARGIN) - CARD_MARGIN
    ) {
      // BEGINNING FEW CARDS
      index = currentScrollPosition > CARD_MARGIN ? 1 : 0
    } else if (
      currentScrollPosition >
      scrollContainerWidth - outerContainerWidth - CARD_MARGIN
    ) {
      // LAST FEW CARDS
      index =
        currentScrollPosition >
        scrollContainerWidth - outerContainerWidth + CARD_MARGIN
          ? Math.floor(
              ((currentScrollPosition +
                outerContainerWidth / 2 +
                CARD_WIDTH +
                CARD_WIDTH / 2 +
                CARD_MARGIN * 2) /
                scrollContainerWidth) *
                possibleChecklistItems.length,
            )
          : possibleChecklistItems.length - 1
    } else {
      // MIDDLE CARDS
      index = Math.round(
        ((currentScrollPosition + outerContainerWidth / 2 + CARD_WIDTH) /
          scrollContainerWidth) *
          possibleChecklistItems.length -
          1,
      )
    }
    setCurrentIndex(index)

    setHideNextButton(currentIndex + 1 === possibleChecklistItems.length)
    updateScrollAndWindowSizes()
  }

  const handleNextCardClick = () => {
    const currentScrolledIndex = currentIndex

    const scrollTargetIndex =
      currentScrolledIndex + 1 !== possibleChecklistItems.length
        ? currentScrolledIndex + 1
        : currentScrolledIndex
    scrollToIndex(scrollTargetIndex)
  }

  const handlePreviousCardClick = () => {
    const currentScrolledIndex = currentIndex
    const scrollTargetIndex =
      currentIndex !== 0 ? currentScrolledIndex - 1 : currentIndex
    scrollToIndex(scrollTargetIndex)
  }

  const scrollToIndex = (index) => {
    updateScrollAndWindowSizes()

    let scrollTargetPos = 0

    let scrollCenteredCardOffset =
      index === possibleChecklistItems.length - 2
        ? // second last item
          outerContainerWidth / 2 - CARD_WIDTH / 2
        : index === 1
        ? // second item
          outerContainerWidth / 2 - CARD_WIDTH / 2 + CARD_MARGIN
        : outerContainerWidth / 2 - CARD_WIDTH / 2 - CARD_MARGIN

    scrollTargetPos =
      (index + 1) * (CARD_WIDTH + CARD_MARGIN) -
      (CARD_WIDTH + CARD_MARGIN) -
      scrollCenteredCardOffset

    if (
      scrollTargetPos > scrollContainerWidth - outerContainerWidth ||
      scrollTargetPos < 0
    ) {
      // The target index is outside the scroll container
      if (
        scrollTargetPos > scrollContainerWidth - outerContainerWidth &&
        index !== possibleChecklistItems.length - 1
      ) {
        // The last few items in the checklist
        scrollTargetPos =
          scrollContainerWidth -
          outerContainerWidth -
          (CARD_WIDTH +
            CARD_MARGIN * (possibleChecklistItems.length - 1 - index)) -
          CARD_WIDTH +
          outerContainerWidth / 2
      } else if (scrollTargetPos < 0 && index !== 0) {
        // The first few items in the checklist
        // Set the second item scroll target to 25 pixels so we can differentiate it from the first item
        scrollTargetPos = CARD_MARGIN * index + 5
      }
    }

    document.getElementById('hotspot-checklist-container').scrollTo({
      left: scrollTargetPos,
      behavior: 'smooth',
    })
    updateScrollAndWindowSizes()
    handleScroll()
  }

  const sortChecklistItems = (checklistItems) => {
    const unsortedChecklistItems = checklistItems

    const sortedChecklistItems = unsortedChecklistItems.sort((a, b) => {
      if (b.condition || a.condition) {
        // if one of the items is complete, sort it first
        return b.condition - a.condition
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

  return (
    <>
      <div className="hotspot-checklist-progress-bar-container">
        <div
          className="hotspot-checklist-progress-bar"
          style={{
            position: 'relative',
            marginBottom: 10,
            backgroundColor: '#182035',
            borderRadius: 20,
            padding: 5,
            position: 'relative',
            display: 'flex',
          }}
        >
          {sortChecklistItems(possibleChecklistItems).map(
            (checklistItem, index) => {
              return (
                <Tooltip title={checklistItem.title}>
                  <div
                    onClick={() => scrollToIndex(index)}
                    className="hotspot-checklist-progress-bar-slice"
                    style={{
                      backgroundColor: checklistItem.condition
                        ? '#32C48D'
                        : '#323b55',
                      height: 8,
                      padding: 5,
                      borderRadius:
                        index === 0
                          ? '10px 0 0 10px'
                          : index + 1 === possibleChecklistItems.length
                          ? '0 10px 10px 0'
                          : '0',
                      border: '2px solid #182035',
                      width: `${(1 / possibleChecklistItems.length) * 100}%`,
                    }}
                  />
                </Tooltip>
              )
            },
          )}
        </div>
      </div>
      <div className="hotspot-checklist-padding-container">
        <div
          style={{ position: 'relative' }}
          id="hotspot-checklist-outer-container"
        >
          {currentIndex !== 0 && (
            <button
              onClick={handlePreviousCardClick}
              className="hotspot-checklist-nav-button"
              style={{
                left: 0,
                zIndex: 2,
                marginLeft: 10,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ height: 20, width: 20, color: 'white' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <div
              onScroll={handleScroll}
              onWheel={handleScroll}
              className="hotspot-checklist-scrollbar"
              id="hotspot-checklist-container"
              style={{
                position: 'relative',
                marginTop: 15,
                backgroundColor: '#182035',
                overflowX: 'scroll',
                padding: CARD_MARGIN,
                position: 'relative',
                display: 'flex',
              }}
            >
              {sortChecklistItems(possibleChecklistItems).map(
                (checklistItem, index) => {
                  return (
                    <>
                      <ChecklistCard
                        isCurrentCard={index === currentIndex}
                        cardWidth={CARD_WIDTH}
                        index={index}
                        tooltipText={checklistItem.infoTooltipText}
                        maxIndex={possibleChecklistItems.length}
                        title={checklistItem.title}
                        detailText={checklistItem.detailText}
                        checked={checklistItem.condition}
                      />
                      {index === possibleChecklistItems.length - 1 && (
                        // Add a spacer div of the margin size on the right of the last item, otherwise it's difficult to get a margin at the end of an overflowed container
                        <div
                          style={{
                            minWidth: CARD_MARGIN,
                          }}
                        />
                      )}
                    </>
                  )
                },
              )}
            </div>
            {/* Shadow for the right side of the container to show that there's more content to be scrolled */}
            <div
              id="hotspot-checklist-inner-shadow"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: 50,
                bottom: 0,
                boxShadow: 'inset -15px 0 8px -2px rgba(0, 0, 0, 0.16)',
              }}
            />
          </div>

          {!hideNextButton && (
            <button
              onClick={handleNextCardClick}
              className="hotspot-checklist-nav-button"
              style={{
                right: 0,
                marginRight: 10,
              }}
            >
              <svg
                style={{ height: 20, width: 20, color: 'white' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default HotspotChecklist
