import { useState } from 'react'
import ChecklistCard from './ChecklistCard'

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
            ).toLocaleString()} blocks behind the Helium blockchain and is roughly ${(
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
      infoTooltipText:
        'Hotspots must be online to sync and mine. Not online? Read our troubleshooting guide (linked below).',
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
          ? `Hotspot was rewarded for creating a challenge ${(
              hotspot.block - activity.challengerTxn.height
            ).toLocaleString()} blocks ago.`
          : `Hotspot hasn’t issued a challenge recently. Hotspots create challenges automatically.`,
      condition: activity.challengerTxn !== null,
    },
    {
      sortOrder: 3,
      title: 'Witness a Challenge',
      detailText:
        activity.witnessTxn !== null
          ? `Hotspot was rewarded for witnessing a challenge ${(
              hotspot.block - activity.witnessTxn.height
            ).toLocaleString()} blocks ago.`
          : `Hotspot hasn't witnessed a challenge yet. Hotspots automatically witness challenges occuring around them.`,
      infoTooltipText:
        'Hotspots that are synced and online can witness challenges if they’re in range of other Hotspots. If there are no Hotspots nearby, they will not be able to witness.',
      condition: activity.witnessTxn !== null,
    },
    {
      sortOrder: 4,
      title: 'Witness List',
      detailText:
        witnesses.length > 0
          ? `Hotspot has ${witnesses.length} Hotspot${
              witnesses.length > 1 && 's'
            } in its witness list.`
          : `Hotspot doesn't have a witness list yet.`,
      infoTooltipText:
        'A Hotspot’s witness list is populated the more challenges it witnesses. Witness Lists refresh periodically to exclude offline Hotspots.',
      condition: witnesses.length > 0,
    },
    {
      sortOrder: 5,
      title: 'Participate in a Challenge',
      detailText:
        activity.challengeeTxn !== null
          ? `Hotspot was rewarded for participating in a challenge ${(
              hotspot.block - activity.challengeeTxn.height
            ).toLocaleString()} blocks ago.`
          : `Hotspot hasn’t participated in a challenge recently.`,
      infoTooltipText:
        'Participation in a challenge depends on having a witness list. Use the checkbox to see Hotspots in your list. It can take a few hours for challenges to include this Hotspot once a witness list is built.',
      condition: activity.challengeeTxn !== null,
    },
    {
      sortOrder: 6,
      title: 'Transferred Data',
      detailText:
        activity.dataTransferTxn !== null
          ? `Hotspot was rewarded for transferring data ${(
              hotspot.block - activity.dataTransferTxn.height
            ).toLocaleString()} blocks ago.`
          : `Hotspot hasn’t transfered data yet.`,
      infoTooltipText:
        'Hotspots transfer encryped data on behalf of devices using the network. Device usage is expanding, and it is normal to have a Hotspot that does not transfer data. This likely means there are no devices using the network in the area.',
      condition: activity.dataTransferTxn !== null,
    },
  ]

  const CARD_WIDTH = 218
  const CARD_MARGIN = 20

  const [currentIndex, setCurrentIndex] = useState(0)
  const [hideNextButton, setHideNextButton] = useState(false)

  const handleScroll = () => {
    const currentScrollPosition = document.getElementById(
      'hotspot-checklist-container',
    ).scrollLeft

    setCurrentIndex(
      Math.floor(
        (currentScrollPosition + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN),
      ),
    )

    const containerOffsetWidth = document.getElementById(
      'hotspot-checklist-container',
    ).offsetWidth
    const containerScrollLeft = document.getElementById(
      'hotspot-checklist-container',
    ).scrollLeft
    const containerScrollWidth = document.getElementById(
      'hotspot-checklist-container',
    ).scrollWidth

    setHideNextButton(
      containerOffsetWidth + containerScrollLeft >=
        containerScrollWidth - CARD_WIDTH,
    )
  }

  const handleNextCardClick = () => {
    document.getElementById('hotspot-checklist-container').scrollTo({
      left: (currentIndex + 1) * (CARD_WIDTH + CARD_MARGIN),
      behavior: 'smooth',
    })
    handleScroll()
  }

  const handlePreviousCardClick = () => {
    document.getElementById('hotspot-checklist-container').scrollTo({
      left: (currentIndex - 1) * (CARD_WIDTH + CARD_MARGIN),
      behavior: 'smooth',
    })
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
      <div style={{ position: 'relative' }}>
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
              style={{ height: 20, width: 20 }}
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
            className="hotspot-checklist-scrollbar"
            id="hotspot-checklist-container"
            style={{
              position: 'relative',
              marginTop: 40,
              backgroundColor: '#1c1d3f',
              borderRadius: 20,
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
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderRadius: '0 20px 20px 0',
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
              style={{ height: 20, width: 20 }}
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
    </>
  )
}

export default HotspotChecklist
