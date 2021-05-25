import classNames from 'classnames'
import { first, last } from 'lodash'
import Widget from './Widget'

const StatWidget = ({
  title,
  series,
  isLoading = false,
  dataKey = 'value',
  valueType = 'default',
  changeType = 'difference',
}) => {
  const value = last(series || [])?.[dataKey]
  const initial = first(series || [])?.[dataKey]

  const valueString = value?.toLocaleString(undefined, stringOpts[valueType])

  return (
    <Widget
      title={title}
      value={valueString}
      subtitle={<Change value={value} initial={initial} type={changeType} />}
      isLoading={isLoading}
    />
  )
}

const Change = ({ value, initial, type }) => {
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

export default StatWidget
