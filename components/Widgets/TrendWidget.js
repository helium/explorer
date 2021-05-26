import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts'
import { first, last } from 'lodash'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import Skeleton from '../Common/Skeleton'
import WidgetChange from './WidgetChange'

const TrendWidget = ({
  title,
  tooltip,
  series,
  valuePrefix,
  locale,
  toLocaleStringOpts = {},
  changeType = 'difference',
  isLoading = false,
  periodLabel = '30 Day Trend',
}) => {
  const yMin = first(series || [])?.value || 0
  const yMax = last(series || [])?.value || 0

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 flex">
      <div className="w-1/3">
        <div className="text-gray-600 text-sm whitespace-nowrap flex space-x-1">
          <span>{title}</span>
          {tooltip && (
            <div className="text-gray-600 text-sm cursor-pointer">
              <Tooltip title={tooltip}>
                <InfoCircleOutlined />
              </Tooltip>
            </div>
          )}
        </div>
        <div className="text-3xl font-medium my-1.5 tracking-tight">
          {isLoading ? (
            <Skeleton w="full" my="4" />
          ) : (
            [valuePrefix, yMax.toLocaleString(locale, toLocaleStringOpts)].join(
              '',
            )
          )}
        </div>
        <WidgetChange
          value={yMax}
          initial={yMin}
          type={changeType}
          isLoading={isLoading}
        />
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
