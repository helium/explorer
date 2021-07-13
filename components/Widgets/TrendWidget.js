import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  Tooltip as RCTooltip,
} from 'recharts'
import { first, last } from 'lodash'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import Image from 'next/image'
import Skeleton from '../Common/Skeleton'
import WidgetChange from './WidgetChange'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white opacity-90 px-2 py-1">
        <p className="text-sm font-sans font-medium text-darkgray-800">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }

  return null
}

const TrendWidget = ({
  title,
  tooltip,
  series,
  valuePrefix,
  valueSuffix,
  changeInitial = 'first',
  changeSuffix,
  locale,
  toLocaleStringOpts = {},
  changeType = 'difference',
  isLoading = false,
  periodLabel = '30 Day Trend',
  linkTo,
}) => {
  const secondLastValue =
    series && series.length > 1 ? series[series?.length - 2]?.value : 0

  const yMin =
    changeInitial === 'second_last'
      ? secondLastValue
      : first(series || [])?.value || 0
  const yMax = last(series || [])?.value || 0

  const inner = (
    <>
      <div>
        <div className="text-gray-600 text-sm whitespace-nowrap flex space-x-1 items-center">
          <span>{title}</span>
          {tooltip && (
            <div className="text-gray-600 text-sm cursor-pointer flex">
              <Tooltip title={tooltip}>
                <InfoCircleOutlined />
              </Tooltip>
            </div>
          )}
        </div>
        <div className="text-3xl font-medium my-1.5 tracking-tight text-black">
          {isLoading ? (
            <Skeleton className="w-full my-4" />
          ) : (
            [
              valuePrefix,
              yMax.toLocaleString(locale, toLocaleStringOpts),
              valueSuffix,
            ].join('')
          )}
        </div>
        <WidgetChange
          value={yMax}
          initial={yMin}
          changeSuffix={changeSuffix}
          type={changeType}
          isLoading={isLoading}
        />
      </div>
      <div
        className={classNames('flex-1 p-4 pr-0 relative', {
          'cursor-pointer': linkTo,
        })}
        style={{ maxWidth: 278 }}
      >
        <ResponsiveContainer width="99%" aspect={4} height="100%">
          <LineChart
            width={300}
            height={100}
            data={series}
            style={linkTo ? { cursor: 'pointer' } : {}}
          >
            <YAxis hide domain={[yMin, yMax]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#474DFF"
              strokeWidth={3}
              dot={false}
            />
            {!linkTo && <RCTooltip content={<CustomTooltip />} />}
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute right-4 bottom-0 text-gray-550 text-xs">
          {periodLabel}
        </div>
      </div>
      {linkTo && (
        <div className="flex" style={{ width: 14 }}>
          <Image src="/images/details-arrow.svg" width={14} height={14} />
        </div>
      )}
    </>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="bg-gray-200 p-3 rounded-lg col-span-2 flex hover:bg-gray-300"
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 flex">{inner}</div>
  )
}

export default TrendWidget
