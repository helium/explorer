import { Tooltip } from 'antd'
import classNames from 'classnames'

const Pill = ({ title, color = 'gray', styleColor, tooltip }) => (
  <Tooltip title={tooltip}>
    <span
      className={classNames(
        'px-2 py-1 text-white text-xs font-medium rounded-full',
        {
          'bg-green-500': !styleColor && color === 'green',
          'bg-gray-700': !styleColor && color === 'gray',
          'bg-yellow-500': !styleColor && color === 'yellow',
        },
      )}
      style={{ backgroundColor: styleColor }}
    >
      {title}
    </span>
  </Tooltip>
)

export default Pill
