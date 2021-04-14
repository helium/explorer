import { first, last } from 'lodash'
import Widget from './Widget'

const StatWidget = ({ title, series }) => {
  const value = last(series || [])?.value
  const initial = first(series || [])?.value

  const stringOpts =
    value <= 1 ? { style: 'percent', maximumFractionDigits: 3 } : undefined

  const valueString = value?.toLocaleString(undefined, stringOpts)

  if (value === initial) {
    return (
      <Widget
        title={title}
        value={valueString}
        subtitle={<span className="text-gray-550">No Change</span>}
      />
    )
  }

  const changeString = (value - initial).toLocaleString(undefined, stringOpts)

  return <Widget title={title} value={valueString} change={changeString} />
}

export default StatWidget
