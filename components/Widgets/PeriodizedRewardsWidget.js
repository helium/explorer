import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { useRewardBuckets } from '../../data/rewards'
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
  const { rewards, isLoading } = useRewardBuckets(
    address,
    type,
    periodLength * 2,
    periodType,
  )

  const handlePeriodChange = useCallback((number, type) => {
    setPeriodLength(number)
    setPeriodType(type)
  }, [])

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
