import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  format,
  fromUnixTime,
  getUnixTime,
  subDays,
  addHours,
  addDays,
} from 'date-fns'

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
        <ResponsiveContainer {...chartProps} style={{ marginRight: 12 }}>
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
              labelFormatter={(label) => {
                if (scale === 'hours') {
                  // API returns previous hour as the timestamp, so add 1 hour to show "[1 hour ago] – [now]" and make it clear what range each bar is showing
                  return `${format(
                    fromUnixTime(label),
                    'h:mm a, MMM do',
                  )} – ${format(
                    addHours(fromUnixTime(label), 1),
                    'h:mm a, MMM do',
                  )}`
                } else if (scale === 'year') {
                  // go back 28 days, 30 - 1 to make range offset from previous bar by 1 day, and - 1 more because we're adding 1 day to the upper limit to make the range read "[30 days ago] - [today]"
                  return `${format(
                    subDays(fromUnixTime(label), 28),
                    'MMM do, y',
                  )} – ${format(addDays(fromUnixTime(label), 1), 'MMM do, y')}`
                } else {
                  // scale is days
                  // API returns previous day as the timestamp for previous 24 hours, so add 1 day to show "[yesterday] – [today]" and make it clear what range each bar is showing
                  return `${format(
                    fromUnixTime(label),
                    'MMM do, y',
                  )} – ${format(addDays(fromUnixTime(label), 1), 'MMM do, y')}`
                }
              }}
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
