import { useState } from 'react'
import classNames from 'classnames'
import {
  useHotspotRewards,
  // useValidatorRewards,
  // useNetworkRewards,
} from '../../data/rewards'
import RewardsTrendWidget from './RewardsTrendWidget'

const RewardPeriodSelector = ({ periods, handlePeriodChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <div className="flex items-center px-1 space-x-3 lg:space-x-2 justify-end">
      {periods.map((p, i) => {
        return (
          <button
            className={classNames(
              'focus:outline-none font-medium text-sm border-solid border border-transparent font-sans focus:border-navy-400 focus:border-opacity-50 bg-gray-300 px-2 rounded-md',
              {
                'text-navy-400': selectedIndex === i,
                'text-black': selectedIndex !== i,
              },
            )}
            onClick={() => {
              setSelectedIndex(i)
              handlePeriodChange(p.number, p.type)
            }}
          >
            {p.number}
            {p.type.slice(0, 1).toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

const HotspotRewardsChart = ({ title, address, periods }) => {
  const [periodLength, setPeriodLength] = useState(periods[0].number)
  const [periodType, setPeriodType] = useState(periods[0].type)

  const handlePeriodChange = (number, type) => {
    setPeriodLength(number)
    setPeriodType(type)
  }

  const { rewards, isLoading } = useHotspotRewards(
    address,
    // * 2 so we get a period of equal length to compare against and give a delta %
    periodLength * 2,
    periodType,
  )

  return (
    <RewardsTrendWidget
      title={title}
      isLoading={isLoading}
      periodLength={periodLength}
      periodSelector={
        <RewardPeriodSelector
          periods={periods}
          handlePeriodChange={handlePeriodChange}
        />
      }
      series={rewards}
      dataPointTimePeriod={periodType}
      periodLabel
    />
  )
}

// TODO in future PR: create <ValidatorRewardsChart /> and <NetworkRewardsChart /> (or any other types where we want selectable time ranges)

const RewardsWidgetCustomPeriods = ({
  title,
  type,
  address,
  periods = [{ number: 30, type: 'day' }],
}) => {
  switch (type) {
    case 'hotspot': {
      return (
        <HotspotRewardsChart
          title={title}
          address={address}
          periods={periods}
        />
      )
    }
    // TODO in future PR: add validator and network options (or any other types where we want selectable time ranges)
    // case 'validator': {
    //   return <ValidatorRewardsChart address={address} periods={periods} />
    // }
    // case 'network': {
    //   return <NetworkRewardsChart address={address} periods={periods} />
    // }
    default:
      return <RewardsTrendWidget title={title} series={[]} />
  }
}

export default RewardsWidgetCustomPeriods
