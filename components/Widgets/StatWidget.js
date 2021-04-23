import { first, last } from 'lodash'
import Widget from './Widget'

const StatWidget = ({ title, series, isLoading = false, suffix }) => {
  const value = last(series || [])?.value
  const initial = first(series || [])?.value

  const stringOpts =
    value <= 1 ? { style: 'percent', maximumFractionDigits: 3 } : undefined

  const valueString = value?.toLocaleString(undefined, stringOpts)

  if (value === initial) {
    return (
      <Widget
        title={title}
        value={suffix ? `${valueString} ${suffix}` : valueString}
        subtitle={<span className="text-gray-550">No Change</span>}
        isLoading={isLoading}
      />
    )
  }

  const changeString = (value - initial).toLocaleString(undefined, stringOpts)

  return (
    <Widget
      title={title}
      value={suffix ? `${valueString} ${suffix}` : valueString}
      change={changeString}
      isLoading={isLoading}
    />
  )
}

export default StatWidget
