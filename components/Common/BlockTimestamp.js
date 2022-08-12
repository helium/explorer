import Timestamp from 'react-timestamp'

const GENESIS_TIME = 1564436673
const GENESIS_HASH = 'La6PuV80Ps9qTP0339Pwm64q3_deMTkv6JOo1251EJI'
const GENESIS_HEIGHT = 1

const BlockTimestamp = ({ blockHash, blockHeight, blockTime, className }) => {
  const isGenesis =
    blockHash === GENESIS_HASH ||
    blockHeight === GENESIS_HEIGHT ||
    blockTime === 0
  const timestamp = isGenesis ? GENESIS_TIME : blockTime
  return <Timestamp date={timestamp} className={className} />
}

export default BlockTimestamp
