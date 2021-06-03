import { Tooltip } from 'antd'
import classNames from 'classnames'

const RelayPill = ({ className }) => {
  return (
    <Tooltip
      placement="top"
      title={
        <>
          Hotspot's connection is being relayed through another Hotspot on the
          network which may affect mining. Go{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            rel="noreferrer"
            href="https://docs.helium.com/troubleshooting/network-troubleshooting"
          >
            here
          </a>{' '}
          to learn more about opening port 44158 for the Hotspot.
        </>
      }
    >
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
        <div className="bg-yellow-500 h-2.5 w-2.5 rounded-full" />
        <p className="text-gray-600 ml-2 mb-0">Relayed</p>
      </div>
    </Tooltip>
  )
}

export default RelayPill
