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
  linkTo,
  span = 1,
  valueSuffix,
}) => {
  const value = last(series || [])?.[dataKey]
  const initial = first(series || [])?.[dataKey]

  const valueString = value?.toLocaleString(undefined, stringOpts[valueType])

  return (
    <Widget
      title={title}
      value={valueString}
      subtitle={
        <WidgetChange value={value} initial={initial} type={changeType} />
      }
      isLoading={isLoading}
      linkTo={linkTo}
      span={span}
      valueSuffix={valueSuffix}
    />
  )
}

const stringOpts = {
  difference: undefined,
  default: undefined,
  percent: { style: 'percent', maximumFractionDigits: 3 },
}

export default StatWidget
