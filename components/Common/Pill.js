import { Tooltip } from 'antd'
import classNames from 'classnames'

const Pill = ({ title, color = 'gray', tooltip }) => (
  <Tooltip title={tooltip}>
    <span
      className={classNames(
        'px-2 py-1 text-white text-xs tracking-wider font-medium rounded-full',
        {
          'bg-green-500': color === 'green',
          'bg-gray-700': color === 'gray',
          'bg-yellow-500': color === 'yellow',
        },
      )}
    >
      {title}
    </span>
  </Tooltip>
)

export default Pill
