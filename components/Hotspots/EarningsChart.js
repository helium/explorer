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

const EarningsChart = ({ rewards, rewardsLoading }) => {
  if (!rewardsLoading) {
    const rewardsToChart = rewards.buckets
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
            data={rewardsToChart}
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
                format(fromUnixTime(unixTime), 'd MMM')
              }
              minTickGap={10}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => format(fromUnixTime(label), 'M/d/yyy')}
              formatter={(value) => [
                value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
                'HNT',
              ]}
              animationDuration={150}
              animationEasing="ease"
              contentStyle={{
                background: '#101725',
                border: 'none',
                borderRadius: 6,
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              // type="stepAfter"
              dataKey="total"
              stroke="rgb(50, 196, 141)"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  } else {
    return <div>Loading</div>
  }
}

export default EarningsChart
