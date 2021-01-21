import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, fromUnixTime, getUnixTime } from 'date-fns'
import useResponsive from '../AppLayout/useResponsive'

const EarningsChart = ({ firstMonth, secondMonth }) => {
  const firstMonthRewards = firstMonth
    ?.map(({ timestamp, total }) => ({
      timestamp: getUnixTime(new Date(timestamp)),
      total: total,
    }))
    .reverse()

  return (
    <div style={{ width: '100%', height: false ? 140 : 300 }}>
      <ResponsiveContainer>
        <LineChart
          height={300}
          data={firstMonthRewards}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#fff' }}
            tickFormatter={(unixTime) =>
              format(fromUnixTime(unixTime), 'd MMM h a')
            }
            minTickGap={80}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="stepAfter"
            dataKey="total"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EarningsChart
