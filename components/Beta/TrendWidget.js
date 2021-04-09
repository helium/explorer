import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    amt: 18000,
  },
  {
    amt: 19000,
  },
  {
    amt: 20500,
  },
  {
    amt: 22700,
  },
  {
    amt: 23900,
  },
  {
    amt: 26400,
  },
  {
    amt: 32597,
  },
]

const TrendWidget = ({ title, value, change }) => {
  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 flex">
      <div>
        <div className="text-gray-600 text-sm whitespace-nowrap">{title}</div>
        <div className="text-3xl font-medium my-1.5 tracking-tighter">
          {value}
        </div>
        <div className="text-green-500 text-sm font-medium">{change}</div>
      </div>
      <div className="w-full p-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={100} data={data}>
            <YAxis hide domain={[18000, 32597]} />
            <Line
              type="monotone"
              dataKey="amt"
              stroke="#474DFF"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute right-4 bottom-0 text-gray-550 text-xs">
          30 Day Trend
        </div>
      </div>
    </div>
  )
}

export default TrendWidget
