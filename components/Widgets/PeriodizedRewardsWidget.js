import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { useRewardBuckets } from '../../data/rewards'
import RewardsTrendWidget from './RewardsTrendWidget'
import useApi from '../../hooks/useApi'

const PeriodizedRewardsWidget = ({
  title,
  type,
  address,
  periods = [
    { number: 24, type: 'hour' },
    { number: 7, type: 'day' },
    { number: 14, type: 'day' },
    { number: 30, type: 'day' },
  ],
  radioAddress = '',
  padding = 3,
}) => {
  const [periodLength, setPeriodLength] = useState(periods[0].number)
  const [periodType, setPeriodType] = useState(periods[0].type)
  const { rewards, isLoading } = useRewardBuckets(
    address,
    type,
    periodLength * 2,
    periodType,
    radioAddress,
  )

  const handlePeriodChange = useCallback((number, type) => {
    setPeriodLength(number)
    setPeriodType(type)
  }, [])

  const { data: averageEarnings } = useApi('/network/rewards/averages')

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
      targetSeries={averageEarnings}
      showTarget={type === 'hotspot' && periodType === 'day'}
      dataPointTimePeriod={periodType}
      periodLabel
      isMobile={type === 'radio' || type === 'hotspotRadios'}
      padding={padding}
    />
  )
}

const RewardPeriodSelector = ({ periods, handlePeriodChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <div className="flex items-center justify-end space-x-3 px-1 lg:space-x-2">
      {periods.map((p, i) => {
        return (
          <button
            className={classNames(
              'rounded-md border border-solid border-transparent bg-gray-300 px-2 font-sans text-sm font-medium focus:border-navy-400 focus:border-opacity-50 focus:outline-none',
              {
                'text-navy-400': selectedIndex === i,
                'text-black': selectedIndex !== i,
              },
            )}
            onClick={() => {
              setSelectedIndex(i)
              handlePeriodChange(p.number, p.type)
            }}
            key={`${i}-${p.type}`}
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
