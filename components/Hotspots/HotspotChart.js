import React from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const HotspotChart = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="block" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
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

export default HotspotChart
