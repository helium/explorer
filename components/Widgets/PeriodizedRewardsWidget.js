import { useCallback, useState } from 'react'
import classNames from 'classnames'
import {
  useAccountRewards,
  useHotspotRewards,
  useValidatorRewards,
} from '../../data/rewards'
import RewardsTrendWidget from './RewardsTrendWidget'

const PeriodizedRewardsWidget = ({
  title,
  type,
  address,
  periods = [
    { number: 24, type: 'hour' },
    { number: 7, type: 'day' },
    { number: 30, type: 'day' },
  ],
}) => {
  const [periodLength, setPeriodLength] = useState(periods[0].number)
  const [periodType, setPeriodType] = useState(periods[0].type)

  const handlePeriodChange = useCallback((number, type) => {
    setPeriodLength(number)
    setPeriodType(type)
  }, [])

  if (!address) return <RewardsTrendWidget title={title} series={[]} />

  switch (type) {
    case 'hotspot': {
      return (
        <HotspotRewardsChart
          title={title}
          address={address}
          periods={periods}
          periodLength={periodLength}
          periodType={periodType}
          handlePeriodChange={handlePeriodChange}
        />
      )
    }
    case 'account': {
      return (
        <AccountRewardsChart
          title={title}
          address={address}
          periods={periods}
          periodLength={periodLength}
          periodType={periodType}
          handlePeriodChange={handlePeriodChange}
        />
      )
    }
    case 'validator': {
      return (
        <ValidatorRewardsChart
          title={title}
          address={address}
          periods={periods}
          periodLength={periodLength}
          periodType={periodType}
          handlePeriodChange={handlePeriodChange}
        />
      )
    }
    default:
      return <RewardsTrendWidget title={title} series={[]} />
  }
}

const HotspotRewardsChart = ({
  title,
  address,
  periods,
  periodLength,
  periodType,
  handlePeriodChange,
}) => {
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

const AccountRewardsChart = ({
  title,
  address,
  periods,
  periodLength,
  periodType,
  handlePeriodChange,
}) => {
  const { rewards, isLoading } = useAccountRewards(
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

const ValidatorRewardsChart = ({
  title,
  address,
  periods,
  periodLength,
  periodType,
  handlePeriodChange,
}) => {
  const { rewards, isLoading } = useValidatorRewards(
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

export default PeriodizedRewardsWidget
