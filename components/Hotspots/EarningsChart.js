import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, fromUnixTime, getUnixTime } from 'date-fns'

const EarningsChart = ({ rewards, rewardsLoading }) => {
  const [focusBar, setFocusBar] = useState(null)
  const handleMouseEvent = (state) => {
    if (state.isTooltipActive) {
      setFocusBar(state.activeTooltipIndex)
    } else {
      setFocusBar(null)
    }
  }
  if (!rewardsLoading) {
    const rewardsToChart = rewards.buckets
      ?.map(({ timestamp, total }) => ({
        timestamp: getUnixTime(new Date(timestamp)),
        total: total,
      }))
      .slice(0, 30)
      .reverse()

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <BarChart
            onMouseEnter={handleMouseEvent}
            onMouseLeave={handleMouseEvent}
            onMouseMove={handleMouseEvent}
            height={100}
            barGap={6}
            data={rewardsToChart}
            // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              axisLine={false}
              tickLine={false}
              height={0}
            />
            <Tooltip
              labelFormatter={(label) => format(fromUnixTime(label), 'M/d/yyy')}
              formatter={(value) => [
                `${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} HNT`,
              ]}
              isAnimationActive={false}
              contentStyle={{
                background: '#101725',
                border: 'none',
                borderRadius: 6,
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar
              minPointSize={8}
              dataKey="total"
              isAnimationActive={false}
              fill="#A6A6D0"
              barSize={8}
              radius={[10, 10, 10, 10]}
            >
              {rewardsToChart.map((entry, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      focusBar === index
                        ? '#474DFF'
                        : entry.total === 0
                        ? '#d5d4ea'
                        : '#A6A6D0'
                    }
                    background={false}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  } else {
    return <div>Loading</div>
  }
}

export default EarningsChart
