import { round } from '@turf/helpers'
import { Tooltip } from 'antd'
import Skeleton from '../Common/Skeleton'
import { useHotspotRewardsSum } from '../../data/rewards'

const Rewards = ({ hotspot }) => {
  const { rewardsSum, isLoading } = useHotspotRewardsSum(hotspot.address)

  if (isLoading) {
    return <Skeleton className="w-1/4" />
  }

  return (
    <Tooltip title="24h Earnings">
      <div className="flex items-center space-x-1">
        <img src="/images/hnt.svg" className="w-3" />{' '}
        <span>{round(rewardsSum, 2)} HNT</span>
      </div>
    </Tooltip>
  )
}

export default Rewards
