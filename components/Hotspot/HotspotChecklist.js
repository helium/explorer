import { useState } from 'react'

const HotspotChecklist = (props) => {
  const possibleChecklistItems = [
    {
      sortOrder: 0,
      title: 'Synced',
      detailText: `This hotspot is ${
        props.blockchainHeight - props.hotspot.status.height
      } blocks behind the Helium blockchain and is roughly ${(
        (props.hotspot.status.height / props.blockchainHeight) *
        100
      ).toFixed(2)}% synced.`,
      condition: props.blockchainHeight - props.hotspot.status.height < 100,
    },
    {
      sortOrder: 1,
      title: 'Online',
      detailText: `This hotspot is ${props.hotspot.status.online}`,
      condition: props.hotspot.status.online === 'online',
    },
    {
      sortOrder: 2,
      title: 'Issued a challenge',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
    {
      sortOrder: 3,
      title: 'Witnessed a challenge',
      detailText: 'Whether this hotspot is online or not',
      condition: false,
    },
    {
      sortOrder: 4,
      title: 'Has witness list',
      detailText: 'Whether this hotspot is online or not',
      condition: false,
    },
    {
      sortOrder: 5,
      title: 'Participated in proof of coverage',
      detailText: 'Whether this hotspot is online or not',
      condition: false,
    },
    {
      sortOrder: 6,
      title: 'Transferred data',
      detailText: 'Whether this hotspot is online or not',
      condition: false,
    },
  ]

  const CARD_WIDTH = 300
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

    const sortedChecklistItems = unsortedChecklistItems.sort(function (a, b) {
      if (b.condition || a.condition) {
        // if one of the items is complete, sort it first
        return b.condition - a.condition
      } else if (a.sortOrder < b.sortOrder) {
        // otherwise, sort them by their "sortOrder field"
        return -1
      }
    })

    return sortedChecklistItems
  }

  const ChecklistCheck = () => {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.9999 19.5999C12.546 19.5999 14.9878 18.5885 16.7881 16.7881C18.5885 14.9878 19.5999 12.546 19.5999 9.9999C19.5999 7.45382 18.5885 5.01203 16.7881 3.21168C14.9878 1.41133 12.546 0.399902 9.9999 0.399902C7.45382 0.399902 5.01203 1.41133 3.21168 3.21168C1.41133 5.01203 0.399902 7.45382 0.399902 9.9999C0.399902 12.546 1.41133 14.9878 3.21168 16.7881C5.01203 18.5885 7.45382 19.5999 9.9999 19.5999ZM14.4483 8.4483C14.6669 8.22198 14.7878 7.91886 14.7851 7.60422C14.7824 7.28958 14.6562 6.98861 14.4337 6.76612C14.2112 6.54363 13.9102 6.41743 13.5956 6.41469C13.2809 6.41196 12.9778 6.53291 12.7515 6.7515L8.7999 10.7031L7.2483 9.1515C7.02198 8.93291 6.71886 8.81196 6.40422 8.81469C6.08958 8.81743 5.78861 8.94363 5.56612 9.16612C5.34363 9.38861 5.21743 9.68958 5.21469 10.0042C5.21196 10.3189 5.33291 10.622 5.5515 10.8483L7.9515 13.2483C8.17654 13.4733 8.4817 13.5996 8.7999 13.5996C9.1181 13.5996 9.42327 13.4733 9.6483 13.2483L14.4483 8.4483Z"
          fill="#32C48D"
        />
      </svg>
    )
  }

  const ChecklistCard = ({ checked, title, detailText, index, maxIndex }) => {
    return (
      <div
        id={`hotspot-checklist-item-${index}`}
        style={{
          backgroundColor: checked ? '#35375c' : '#242747',
          height: '100%',
          // for the last card, we use a spacer div instead of margin
          marginRight: index + 1 === maxIndex ? '0px' : '20px',
          minWidth: `${CARD_WIDTH}px`,
          width: `${CARD_WIDTH}px`,
          borderRadius: '10px',
          display: 'block',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '10px 10px',
          }}
        >
          <div style={{ maxWidth: 'calc(100% - 40px)' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'flex-row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <h2
                style={{
                  fontFamily: 'soleil',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '15px',
                  lineHeight: '19.05px',
                }}
              >
                {title}
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  color: 'white',
                  height: 18,
                  width: 18,
                  marginBottom: 6,
                  marginLeft: 6,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              style={{
                color: '#9D9FCA',
                fontFamily: 'soleil',
                fontSize: '14px',
                lineHeight: '17.78px',
                fontWeight: 400,
              }}
            >
              {detailText}
            </p>
          </div>
          <div>{checked && <ChecklistCheck />}</div>
        </div>
      </div>
    )
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
              marginTop: 20,
              backgroundColor: '#1c1d3f',
              borderRadius: 20,
              overflowX: 'scroll',
              padding: CARD_MARGIN,
              position: 'relative',
              display: 'flex',
              height: 185,
            }}
          >
            {sortChecklistItems(possibleChecklistItems).map(
              (checklistItem, index) => {
                return (
                  <>
                    <ChecklistCard
                      index={index}
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
