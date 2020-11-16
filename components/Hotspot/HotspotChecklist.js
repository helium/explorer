import Link from 'next/link'

const HotspotChecklist = (props) => {
  console.log(props.blockchainHeight)
  console.log(props.hotspot)

  const possibleChecklistItems = [
    {
      incompleteOrder: 0,
      title: 'Synced',
      detailText:
        'How close to the current block height this hotspot is synchronized to',
      condition: props.blockchainHeight - props.hotspot.status.height < 100,
    },
    {
      incompleteOrder: 1,
      title: 'Online',
      // detailText: 'Whether this hotspot is online or not',
      detailText: `This hotspot is ${(
        (props.hotspot.status.height / props.blockchainHeight) *
        100
      ).toFixed(2)}% synced.`,
      condition: true,
    },
    {
      incompleteOrder: 2,
      title: 'Issued Challenge',
      detailText: 'Whether this hotspot is online or not',
      condition: true,
    },
  ]

  const ChecklistCheck = ({ checked }) => {
    return (
      <div
        style={{
          display: checked ? 'block' : 'none',
          backgroundColor: '#32c48d',
          width: 20,
          height: 20,
          borderRadius: 20,
        }}
      ></div>
    )
  }

  const ChecklistCard = ({ checked, title, detailText }) => {
    return (
      <div
        style={{
          backgroundColor: checked ? '#35375c' : '#242747',
          height: '100%',
          padding: '10px 10px',
          marginRight: '20px',
          minWidth: '300px',
          width: '300px',
          borderRadius: '10px',
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
    )
  }

  return (
    <>
      <div
        className="hotspot-checklist-scrollbar"
        style={{
          marginTop: 20,
          backgroundColor: '#1c1d3f',
          borderRadius: 20,
          height: 185,
          padding: 24,
          display: 'flex',
          overflowX: 'scroll',
        }}
      >
        {possibleChecklistItems.map((checklistItem, index) => {
          return (
            <ChecklistCard
              title={checklistItem.title}
              detailText={checklistItem.detailText}
              checked={checklistItem.condition}
            />
          )
        })}
      </div>
    </>
  )
}

export default HotspotChecklist
