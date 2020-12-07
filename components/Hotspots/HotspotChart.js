import React from 'react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { format, fromUnixTime } from 'date-fns'
import useResponsive from '../AppLayout/useResponsive'

const HotspotChart = ({ data }) => {
  const { isMobile, isClient } = useResponsive()

  if (!isClient) return <div style={{ width: '100%', height: 300 }} />

  return (
    <div style={{ width: '100%', height: isMobile ? 200 : 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(unixTime) =>
              format(fromUnixTime(unixTime), 'd MMM')
            }
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#fff' }}
            minTickGap={80}
          />
          <Tooltip
            labelFormatter={(label) => format(fromUnixTime(label), 'M/d/yyy')}
            formatter={(value) => [value.toLocaleString(), 'Hotspots']}
            contentStyle={{
              background: '#101725',
              border: 'none',
              borderRadius: 6,
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Area
            dataKey="count"
            stroke="#29d391"
            strokeWidth="2"
            fill="#29d391"
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HotspotChart
