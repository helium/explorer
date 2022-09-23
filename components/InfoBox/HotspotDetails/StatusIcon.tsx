import React, { memo, useMemo } from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'

type Props = {
  status: 'Active' | 'Inactive' | 'Unknown' | 'Not Available' | 'Fail' | 'Pass'
  hidden?: boolean
  fontSize?: string
  tooltip?: string
  className?: string
}
const StatusIcon = ({
  status,
  hidden,
  fontSize = 'text-sm',
  tooltip,
  className,
}: Props) => {
  const backgroundColor = useMemo(() => {
    switch (status) {
      default:
        return 'bg-gray-400'

      case 'Active':
      case 'Pass':
        return 'bg-green-400'

      case 'Fail':
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
      case 'Pass':
      case 'Inactive':
        return 'text-white'

      case 'Not Available':
      case 'Unknown':
        return 'text-gray-600'

      case 'Fail':
        return 'text-white'
    }
  }, [status])

  if (hidden) return null

  return (
    <Tooltip title={tooltip}>
      <div
        className={classNames(
          className,
          `flex items-center justify-center ${backgroundColor} rounded-2xl px-3 ${textColor} cursor-default`,
        )}
      >
        <span className={`${fontSize}`}>{status}</span>
      </div>
    </Tooltip>
  )
}

export default memo(StatusIcon)
