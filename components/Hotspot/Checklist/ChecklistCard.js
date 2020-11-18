import ChecklistCheck from './ChecklistCheck'
import { Tooltip } from 'antd'

const ChecklistCard = ({
  checked,
  title,
  tooltipText,
  detailText,
  index,
  maxIndex,
  cardWidth,
}) => {
  return (
    <div
      id={`hotspot-checklist-item-${index}`}
      style={{
        backgroundColor: checked ? '#35375c' : '#242747',
        minHeight: '108px',
        // for the last card, we use a spacer div instead of margin
        marginRight: index + 1 === maxIndex ? '0px' : '20px',
        minWidth: `${cardWidth}px`,
        width: `${cardWidth}px`,
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
        <div style={{ maxWidth: 'calc(100% - 30px)' }}>
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
            <Tooltip placement="top" title={tooltipText}>
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
            </Tooltip>
          </div>
          <p
            style={{
              color: '#9D9FCA',
              fontFamily: 'soleil',
              fontSize: '11px',
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

export default ChecklistCard
