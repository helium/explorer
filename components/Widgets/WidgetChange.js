import classNames from 'classnames'
import { memo } from 'react'
import Skeleton from '../Common/Skeleton'

const WidgetChange = ({
  value,
  initial,
  type,
  isLoading = false,
  changeSuffix,
}) => {
  if (isLoading) return <Skeleton className="w-1/3" />

  if (value === initial) return <span className="text-gray-550">No Change</span>

  const change = calculateChange[type](value, initial)
  if (change === Infinity)
    return <span className="text-gray-550">No Prior Data</span>
  const changeString = change.toLocaleString(undefined, stringOpts[type])

  return (
    <div
      className={classNames('text-sm font-medium', {
        'text-green-500': change > 0,
        'text-navy-400': change < 0,
      })}
    >
      {change > 0 ? '+' : ''}
      {changeString}
      {changeSuffix && changeSuffix}
    </div>
  )
}

const stringOpts = {
  difference: undefined,
  default: undefined,
  percent: { style: 'percent', maximumFractionDigits: 3 },
}

const calculateChange = {
  difference: (value, initial) => value - initial,
  percent: (value, initial) => (value - initial) / initial,
}

export default memo(WidgetChange)
