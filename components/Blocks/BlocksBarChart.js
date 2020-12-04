import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, fromUnixTime } from 'date-fns'
import useResponsive from '../AppLayout/useResponsive'

const BlocksBarChart = ({ data }) => {
  const { isMobile, isClient } = useResponsive()
  const [focusBar, setFocusBar] = useState(null)
  const handleMouseEvent = (state) => {
    if (state.isTooltipActive) {
      setFocusBar(state.activeTooltipIndex)
    } else {
      setFocusBar(null)
    }
  }

  if (!isClient) return <div style={{ width: '100%', height: 300 }} />

  return (
    <div style={{ width: '100%', height: isMobile ? 100 : 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          onMouseEnter={handleMouseEvent}
          onMouseLeave={handleMouseEvent}
          onMouseMove={handleMouseEvent}
          margin={
            isMobile
              ? {
                  top: 5,
                  right: 10,
                  left: 10,
                }
              : {
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }
          }
        >
          <XAxis
            hide
            dataKey="height"
            type="number"
            // scale="time"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#fff' }}
            tickFormatter={(unixTime) =>
              format(fromUnixTime(unixTime), 'd MMM')
            }
            minTickGap={80}
            // interval="preserveStartEnd"
          />
          <Tooltip
            labelFormatter={(label) => `#${label.toLocaleString()}`}
            formatter={(value) => [value, 'Transactions']}
            contentStyle={{
              background: '#101725',
              border: 'none',
              borderRadius: 6,
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar
            dataKey="transactionCount"
            fill="#303C54"
            radius={[10, 10, 10, 10]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={focusBar === index ? '#5850EB' : '#303C54'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BlocksBarChart
