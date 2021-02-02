import React, { PureComponent } from 'react'
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts'

const COLORS = [
  '#29D391',
  '#38A2FF',
  '#E68B00',
  '#FF6666',
  '#BE73FF',
  '#595a9a',
  '#FFC769',
  '#9AE8C9',
]

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props

  return (
    <g>
      <text
        scaletofit={'true'}
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#fff">
        {value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#222e46"
        strokeWidth="3"
      />
    </g>
  )
}

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/'

  state = {
    activeIndex: 0,
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    })
  }

  render() {
    const { data } = this.props
    return (
      <div style={{ width: 230, height: 230 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={data}
              innerRadius={75}
              outerRadius={110}
              fill="#8884d8"
              stroke="#222e46"
              strokeWidth="3"
              dataKey="value"
              onMouseEnter={this.onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
