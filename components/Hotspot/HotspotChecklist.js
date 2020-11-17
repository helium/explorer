import { useState } from 'react'

const HotspotChecklist = (props) => {
  const CARD_WIDTH = 300
  const CARD_MARGIN = 20

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = () => {
    const currentScrollPosition = document.getElementById(
      'hotspot-checklist-container',
    ).scrollLeft

    setCurrentIndex(
      Math.floor(
        (currentScrollPosition + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN),
      ),
    )
    // console.log(`Current index: ${currentIndex}`)
    // console.log(`Current scroll position: ${currentScrollPosition}`)
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

  const possibleChecklistItems = [
    {
      incompleteOrder: 0,
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
      incompleteOrder: 1,
      title: 'Online',
      detailText: `This hotspot is ${props.hotspot.status.online}`,
      condition: props.hotspot.status.online === 'online',
    },
    {
      incompleteOrder: 2,
      title: 'Issued a challenge',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
    {
      incompleteOrder: 3,
      title: 'Witnessed a challenge',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
    {
      incompleteOrder: 4,
      title: 'Has witness list',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
    {
      incompleteOrder: 5,
      title: 'Participated in proof of coverage',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
    {
      incompleteOrder: 6,
      title: 'Transferred data',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
  ]

  const ChecklistCheck = ({ checked }) => {
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
          padding: '10px 10px',
          marginRight: index + 1 === maxIndex ? '100px' : '20px',
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
          }}
        >
          <div style={{ maxWidth: 'calc(100% - 40px)' }}>
            <h3>{title}</h3>
            <p>{detailText}</p>
          </div>
          <ChecklistCheck checked={checked} />
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
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 2,
              top: '72.5px',
              height: 30,
              minWidth: 30,
              width: 30,
              marginLeft: 10,
              borderRadius: '30px',
              outline: 'none',
              border: 'none',
            }}
          >
            {'<'}
          </button>
        )}
        <div
          onScroll={handleScroll}
          className="hotspot-checklist-scrollbar"
          id="hotspot-checklist-container"
          style={{
            position: 'relative',
            marginTop: 20,
            backgroundColor: '#1c1d3f',
            borderRadius: 20,
            height: 185,
            padding: CARD_MARGIN,
            display: 'flex',
            overflowX: 'scroll',
            borderRight: '20px solid #1c1d3f',
          }}
        >
          {possibleChecklistItems.map((checklistItem, index) => {
            return (
              <ChecklistCard
                index={index}
                maxIndex={possibleChecklistItems.length}
                title={checklistItem.title}
                detailText={checklistItem.detailText}
                checked={checklistItem.condition}
              />
            )
          })}
        </div>

        {currentIndex + 1 !== possibleChecklistItems.length && (
          <button
            onClick={handleNextCardClick}
            style={{
              position: 'absolute',
              top: '72.5px',
              right: 0,
              height: 30,
              minWidth: 30,
              width: 30,
              marginRight: 10,
              borderRadius: '30px',
              outline: 'none',
              border: 'none',
            }}
          >
            {'>'}
          </button>
        )}
      </div>
    </>
  )
}

export default HotspotChecklist
