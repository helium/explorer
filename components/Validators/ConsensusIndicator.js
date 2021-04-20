import { Tooltip } from 'antd'
import React from 'react'

const ConsensusIndicator = ({ address, recentGroups }) => {
  if (!recentGroups || recentGroups.length === 0) return null
  const lastGroups = recentGroups.slice(0, 5).reverse()
  return (
    <span className="flex space-x-1">
      {lastGroups.map(({ members, height }, i) => {
        const elected = members.includes(address)
        return (
          <Tooltip
            title={elected ? 'In consensus' : 'Not in consensus'}
            key={`ci-${address}-${height}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: elected ? '#9d6aee' : '#ccc',
                opacity: i === lastGroups.length - 1 ? 1 : 0.6,
              }}
            />
          </Tooltip>
        )
      })}
    </span>
  )
}

export default ConsensusIndicator
