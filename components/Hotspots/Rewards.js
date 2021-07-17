import { round } from '@turf/helpers'
import { useAsync } from 'react-async-hook'
import { Tooltip } from 'antd'
// import client from '../../data/client'
import Skeleton from '../Common/Skeleton'

const fetchRewards = async (address) => {
  // const value = await client.hotspot(address).rewards.sum.get('-1 day')
  // TODO need to fix helium-js to take min time in this format
  // TODO use swr for this but with a long dedup time
  const response = await fetch(
    `https://api.helium.io/v1/hotspots/${address}/rewards/sum/?min_time=-1%20day`,
  )
  const {
    data: { total },
  } = await response.json()
  return total
}

const Rewards = ({ hotspot }) => {
  const { result: rewards, loading } = useAsync(async () => {
    if (!hotspot?.address) return 0
    return fetchRewards(hotspot.address)
  }, [hotspot.address])

  if (loading) {
    return <Skeleton className="w-1/4" />
  }

  return (
    <Tooltip title="24h Earnings">
      <div className="flex items-center space-x-1">
        <img src="/images/hnt.svg" className="w-3" />{' '}
        <span>{round(rewards, 2)} HNT</span>
      </div>
    </Tooltip>
  )
}

export default Rewards
