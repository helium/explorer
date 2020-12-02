import React from 'react'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from 'recharts'
import { format, fromUnixTime } from 'date-fns'
import round from 'lodash/round'

const OraclePriceChart = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 30,
          // bottom: 5,
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
          tickFormatter={(unixTime) => format(fromUnixTime(unixTime), 'd MMM')}
          minTickGap={80}
          // interval="preserveStartEnd"
        />
        <Tooltip
          labelFormatter={(label) => format(fromUnixTime(label), 'M/d/yyy')}
          formatter={(value) => [`$${round(value, 2)}`, 'Oracle price']}
          animationDuration={150}
          animationEasing="ease"
          contentStyle={{
            background: '#101725',
            border: 'none',
            borderRadius: 6,
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Line dataKey="price" stroke="#fff" strokeWidth="2" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default OraclePriceChart
