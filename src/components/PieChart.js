import React, { PureComponent } from 'react';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';

const data = [
  { name: 'PoC Challenge', value: 200 },
  { name: 'PoC Receipt', value: 200 },
  { name: 'Mining Reward', value: 200 },
  { name: 'Consensus Election', value: 200 },
  { name: 'PoC Challenger', value: 200 },
  { name: 'PoC Challengee', value: 200 },
  { name: 'PoC Witness', value: 200 },
  { name: 'Security Token Reward', value: 200 },

];

  const COLORS = ['#29D391', '#38A2FF', '#E68B00', '#FF6666','#BE73FF', '#595a9a', '#FFC769', '#9AE8C9'];


const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';



  return (
    <g>
      <text scaleToFit={true} x={cx} y={cy-10} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
     <text x={cx} y={cy+10} dy={8} textAnchor="middle" fill="#fff">{value}</text>


      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#27284b"
        strokeWidth="3"

      />
    
    </g>
  );
};


export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';

  state = {
    activeIndex: 0,
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
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
          stroke="#27284b"
          strokeWidth="3"
          dataKey="value"
          onMouseEnter={this.onPieEnter}
        >
        {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
          </Pie>
      </PieChart>
      </ResponsiveContainer>
      </div>
    );
  }
}
