import { round } from '@turf/helpers'
import { Tooltip } from 'antd'
import Skeleton from '../Common/Skeleton'
import { useValidatorRewardsSum } from '../../data/rewards'

const Rewards = ({ validator }) => {
  const { rewardsSum, isLoading } = useValidatorRewardsSum(validator.address, 30)

  if (isLoading) {
    return <Skeleton className="w-1/4" />
  }

  return (
    <Tooltip title="HNT earned (30 days)">
      <div className="flex items-center space-x-1">
        <img alt="" src="/images/hnt.svg" className="w-3" />{' '}
        <span>{round(rewardsSum, 2)} HNT</span>
      </div>
    </Tooltip>
  )
}

export default Rewards
