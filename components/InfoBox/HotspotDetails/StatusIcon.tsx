import React, { memo, useMemo } from 'react'
import { Tooltip } from 'antd'

type Props = {
  status:
    | 'Active'
    | 'Inactive'
    | 'Unknown'
    | 'Not Available'
    | 'Failed'
    | 'Passed'
  hidden?: boolean
  fontSize?: string
  tooltip?: string
}
const StatusIcon = ({
  status,
  hidden,
  fontSize = 'text-sm',
  tooltip,
}: Props) => {
  const backgroundColor = useMemo(() => {
    switch (status) {
      default:
        return 'bg-gray-400'

      case 'Active':
      case 'Passed':
        return 'bg-green-400'

      case 'Failed':
      case 'Inactive':
        return 'bg-red-400'

      case 'Not Available':
      case 'Unknown':
        return 'bg-gray-400'
    }
  }, [status])

  const textColor = useMemo(() => {
    switch (status) {
      default:
        return 'text-white'

      case 'Active':
      case 'Passed':
      case 'Inactive':
        return 'text-white'

      case 'Not Available':
      case 'Unknown':
        return 'text-gray-600'

      case 'Failed':
        return 'text-white'
    }
  }, [status])

  if (hidden) return null

  return (
    <Tooltip title={tooltip}>
      <div
        className={`flex items-center justify-center ${backgroundColor} rounded-2xl px-2 ${textColor} cursor-default`}
      >
        <span className={`${fontSize}`}>{status}</span>
      </div>
    </Tooltip>
  )
}

export default memo(StatusIcon)
