import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts'
import classNames from 'classnames'
import { first, last } from 'lodash'
import Skeleton from '../Common/Skeleton'
import { useMemo } from 'react'

const TrendWidget = ({
  title,
  series,
  isLoading = false,
  periodLabel = '30 Day Trend',
}) => {
  const yMin = first(series || [])?.value || 0
  const yMax = last(series || [])?.value || 0

  const change = useMemo(() => yMax - yMin, [yMax, yMin])

  const renderChange = () => {
    if (isLoading) {
      return <Skeleton w="1/3" />
    }

    if (yMax === yMin) {
      return <span className="text-gray-550">No Change</span>
    }

    const prefix = change > 0 ? '+' : ''
    return [prefix, change.toLocaleString()].join('')
  }

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 flex">
      <div className="w-1/3">
        <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
        <div className="text-3xl font-medium my-1.5 tracking-tight">
          {isLoading ? <Skeleton w="full" my="4" /> : yMax.toLocaleString()}
        </div>
        <div
          className={classNames('text-sm font-medium', {
            'text-green-500': change > 0,
            'text-navy-400': change < 0,
          })}
        >
          {renderChange()}
        </div>
      </div>
      <div className="w-full p-4 pr-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={100} data={series}>
            <YAxis hide domain={[yMin, yMax]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#474DFF"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute right-4 bottom-0 text-gray-550 text-xs">
          {periodLabel}
        </div>
      </div>
    </div>
  )
}

export default TrendWidget
