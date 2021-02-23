import RewardSummaryCard from './RewardSummaryCard'
import { sumBy } from 'lodash'

const RewardSummary = ({ rewards, rewardsLoading }) => {
  let yearBuckets = []
  if (!rewardsLoading) yearBuckets = rewards.buckets.year

  const splitYearIntoMonths = (incomingArray) => {
    const splitSize = 30
    let index = 0
    let arrayLength = incomingArray.length
    let tempArray = []

    for (index = 0; index < arrayLength; index += splitSize) {
      let sumOfMonth = sumBy(
        incomingArray.slice(index, index + splitSize),
        'total',
      )
      tempArray.push({
        timestamp: incomingArray[index].timestamp,
        total: sumOfMonth,
      })
    }

    return tempArray
  }
  const monthBucketsForYear = splitYearIntoMonths(yearBuckets)

  return (
    <div
      className="earnings-chart-period-container"
      style={{
        backgroundColor: 'white',
      }}
    >
      <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500 }}>
        Rewards
      </p>
      <div className="earnings-chart-period-wrapper">
        <RewardSummaryCard
          value={rewards.day}
          buckets={rewards.buckets}
          previousValue={rewards.previousDay}
          rewardsLoading={rewardsLoading}
          timeframeString="24 Hours"
          scale="hours"
          slices={24}
        />
        {/* the 7 day chart right now just looks like a smaller slice of the 30 day chart. leaving the code here for easy access / reference in case we revisit this section */}
        {/* <RewardSummaryCard
          value={rewards.week}
          buckets={rewards.buckets}
          previousValue={rewards.previousWeek}
          rewardsLoading={rewardsLoading}
          timeframeString="7 Days"
          scale="days"
          width="30%"
          slices={7}
        /> */}
        <RewardSummaryCard
          value={rewards.month}
          buckets={rewards.buckets}
          previousValue={rewards.previousMonth}
          rewardsLoading={rewardsLoading}
          timeframeString="30 Days"
          scale="days"
          slices={30}
        />
        <RewardSummaryCard
          value={rewards.oneYear}
          buckets={monthBucketsForYear}
          rewardsLoading={rewardsLoading}
          timeframeString="1 Year"
          scale="years"
          slices={12}
        />
      </div>
    </div>
  )
}

export default RewardSummary
