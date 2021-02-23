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

const EarningsChart = ({ loading, slices, buckets, width, scale }) => {
  const [focusBar, setFocusBar] = useState(null)
  const handleMouseEvent = (state) => {
    if (state.isTooltipActive) {
      setFocusBar(state.activeTooltipIndex)
    } else {
      setFocusBar(null)
    }
  }

  if (!loading) {
    let rewardBuckets = buckets
    const valueToChart = rewardBuckets
      .map(({ timestamp, total }) => ({
        timestamp: getUnixTime(new Date(timestamp)),
        total: total,
      }))
      .slice(0, slices)

    let chartProps = {}
    if (width) chartProps.width = width

    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <ResponsiveContainer {...chartProps} style={{ paddingRight: 12 }}>
          <BarChart
            onMouseEnter={handleMouseEvent}
            onMouseLeave={handleMouseEvent}
            onMouseMove={handleMouseEvent}
            barGap={6}
            data={valueToChart}
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
              labelFormatter={(label) =>
                scale === 'hours'
                  ? `${format(fromUnixTime(label), 'h:mm a')}`
                  : format(fromUnixTime(label), 'M/d/yyy')
              }
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
              {valueToChart.map((entry, index) => {
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
