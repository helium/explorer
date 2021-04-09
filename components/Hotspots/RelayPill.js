import { Tooltip } from 'antd'
import classNames from 'classnames'

const RelayPill = ({ className }) => {
  return (
    <div
      className={classNames(
        'flex',
        'flex-row',
        'items-center',
        'justify-center',
        'py-0.5',
        'px-2.5',
        'bg-navy-600',
        'rounded-full',
        className,
      )}
    >
      <Tooltip placement="top" title={`Hotspot is being relayed`}>
        <div className="bg-yellow-500 h-2.5 w-2.5 rounded-full" />
      </Tooltip>
      <Tooltip
        placement="top"
        title={
          <>
            Hotspot is being relayed which may affect mining. Go{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              rel="noreferrer"
              href="https://intercom.help/heliumnetwork/en/articles/3207912-troubleshooting-network-connection-issues"
            >
              here
            </a>{' '}
            to learn more about opening ports for the Hotspot.
          </>
        }
      >
        <p className="text-gray-600 ml-2 mb-0">Relayed</p>
      </Tooltip>
    </div>
  )
}

export default RelayPill
