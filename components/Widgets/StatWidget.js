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
  changeInitial = 'first',
  linkTo,
  span = 1,
  valueSuffix,
  changeSuffix,
}) => {
  const secondLastValue =
    series && series.length > 1 ? series[series.length - 2]?.[dataKey] : 0

  const value = last(series || [])?.[dataKey]
  const initial =
    changeInitial === 'second_last'
      ? secondLastValue
      : first(series || [])?.[dataKey]

  const valueString = value?.toLocaleString(undefined, stringOpts[valueType])

  return (
    <Widget
      title={title}
      value={valueString}
      subtitle={
        <WidgetChange
          value={value}
          initial={initial}
          type={changeType}
          changeSuffix={changeSuffix}
        />
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
