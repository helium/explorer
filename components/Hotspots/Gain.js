import { Tooltip } from 'antd'

const formatGain = (gain) => {
  return `${gain / 10} dBi`
}

const Gain = ({ hotspot }) => {
  return (
    <Tooltip title="Antenna Gain">
      <div className="flex items-center space-x-1">
        <img src="/images/gain.svg" className="w-3" />{' '}
        <span>{formatGain(hotspot.gain)}</span>
      </div>
    </Tooltip>
  )
}

export default Gain
