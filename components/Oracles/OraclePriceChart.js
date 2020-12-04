import React from 'react'
import { XAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts'
import { format, fromUnixTime } from 'date-fns'
import useResponsive from '../AppLayout/useResponsive'

const OraclePriceChart = ({ data }) => {
  const { isMobile, isClient } = useResponsive()

  if (!isClient) {
    return <div style={{ width: '100%', height: 300 }} />
  }

  return (
    <div style={{ width: '100%', height: isMobile ? 140 : 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 30,
          }}
        >
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#fff' }}
            tickFormatter={(unixTime) =>
              format(fromUnixTime(unixTime), 'd MMM')
            }
            minTickGap={80}
          />
          <Tooltip
            labelFormatter={(label) =>
              format(fromUnixTime(label), 'M/d/yyy hh:mm a')
            }
            formatter={(value) => [
              value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              'Oracle price',
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
            type="stepAfter"
            dataKey="price"
            stroke="#fff"
            strokeWidth="2"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OraclePriceChart
