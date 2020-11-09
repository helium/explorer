import React from 'react'
import Timestamp from 'react-timestamp'

const SearchResultBlock = ({ height, time, hash, transactionCount }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span>{`#${height.toLocaleString()}`}</span>
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontSize: '0.75rem',
      }}
    >
      <span>
        <Timestamp
          date={
            hash === 'La6PuV80Ps9qTP0339Pwm64q3_deMTkv6JOo1251EJI'
              ? 1564436673
              : time
          }
        />
      </span>
      <span>{transactionCount} transactions</span>
    </span>
  </div>
)

export default SearchResultBlock
