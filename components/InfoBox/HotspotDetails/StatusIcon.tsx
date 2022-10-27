import React, { memo, useMemo } from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { InfoCircleOutlined } from '@ant-design/icons'
import { SpeedTestTier } from '../../Widgets/CellSpeedtestWidget'

type Props = {
  status:
    | 'Active'
    | 'Inactive'
    | 'Unknown'
    | 'Not Available'
    | 'Not Enough Data'
    | 'Fail'
    | 'Pass'
    | SpeedTestTier
  hidden?: boolean
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  tooltip?: string
  className?: string
  showTooltipIcon?: boolean
}
const StatusIcon = ({
  status,
  hidden,
  fontSize = 'sm',
  tooltip,
  className,
  showTooltipIcon = true,
}: Props) => {
  const backgroundColor = useMemo(() => {
    switch (status) {
      case SpeedTestTier.FAIL:
      case 'Not Available':
      case 'Unknown':
      default:
        return 'bg-gray-600'

      case SpeedTestTier.ACCEPTABLE:
      case 'Active':
      case 'Pass':
        return 'bg-green-300'

      case SpeedTestTier.DEGRADED:
        return 'bg-yellow-300'

      case SpeedTestTier.POOR:
      case 'Fail':
      case 'Inactive':
        return 'bg-red-300'
    }
  }, [status])

  if (hidden) return null

  return (
    <Tooltip title={tooltip}>
      <div className="flex flex-row items-center">
        <div
          className={classNames(
            className,
            backgroundColor,
            `flex cursor-default items-center justify-center rounded-2xl px-3 text-white`,
          )}
        >
          <span className={`text-${fontSize}`}>{status}</span>
        </div>
        {tooltip !== undefined && showTooltipIcon && (
          <InfoCircleOutlined className="ml-1 text-gray-600" />
        )}
      </div>
    </Tooltip>
  )
}

export default memo(StatusIcon)
