import { first, last } from 'lodash'
import Widget from './Widget'
import WidgetChange from './WidgetChange'

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

  const valueString = value?.toLocaleString()

  return (
    <Widget
      title={title}
      value={valueString}
      subtitle={
        <WidgetChange value={value} initial={initial} type={changeType} />
      }
      isLoading={isLoading}
    />
  )
}

export default StatWidget
