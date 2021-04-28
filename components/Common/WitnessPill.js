import { Tooltip } from 'antd'

const WitnessPill = ({ count }) => (
  <Tooltip title={`${count} witnesses`}>
    <span className="px-2 py-1 text-white text-xs tracking-wider font-medium rounded-full bg-yellow-500 flex items-center justify-center space-x-1">
      <img src="/images/witness-mini.svg" />
      <span>{count}</span>
    </span>
  </Tooltip>
)

export default WitnessPill
