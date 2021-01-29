import React, { PureComponent } from 'react'
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts'

const data = [
  {
    name: 'Block 300000',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Block 300000',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Block 300000',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Block 300000',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Block 300000',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Block 300000',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Block 300000',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Block 300000',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Block 300000',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Block 300000',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Block 300000',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Block 300000',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Block 300000',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Block 300000',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Block 300000',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Block 300000',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Block 300000',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Block 300000',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Block 300000',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Block 300000',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div style={{ background: 'none', color: 'white' }}>
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/9kd8rssL/'

  render() {
    return (
      <div style={{ width: '100%', height: 120 }}>
        <ResponsiveContainer>
          <BarChart data={data} barCategoryGap={10}>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar dataKey="uv" fill="#3F416D" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
