import { Tooltip } from 'antd'
import classNames from 'classnames'

const Pill = ({ title, color = 'gray', tooltip }) => (
  <Tooltip title={tooltip}>
    <span
      className={classNames(
        'px-2 py-1 text-white text-xs font-medium whitespace-nowrap rounded-full',
        {
          // generic colors based on status
          'bg-green-500': color === 'green',
          'bg-gray-700': color === 'gray',
          'bg-yellow-500': color === 'yellow',
          'bg-purple-500': color === 'purple',
          // colors based on reward type
          'bg-reward-witness': color === 'witness',
          'bg-reward-challenger': color === 'challenger',
          'bg-reward-challengee': color === 'challengee',
          'bg-reward-data': color === 'data',
          'bg-reward-consensus': color === 'consensus',
        },
      )}
    >
      {title}
    </span>
  </Tooltip>
)

export default Pill
