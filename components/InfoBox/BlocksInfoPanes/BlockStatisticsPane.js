import TrendWidget from '../../Widgets/TrendWidget'
import StatWidget from '../../Widgets/StatWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { round } from 'lodash'
import { useState, useEffect } from 'react'

const BlockStatisticsPane = () => {
  let { data: blocks } = useApi('/metrics/blocks')

  const [processingData, setProcessingData] = useState(true)
  const [electionTimes, setElectionTimes] = useState()
  const [blockTimeDay, setBlockTimeDay] = useState()
  // const [blockTimeWeek, setBlockTimeWeek] = useState()
  // const [blockTimeMonth, setBlockTimeMonth] = useState()

  useEffect(() => {
    setProcessingData(true)
    const electionTimesArray = blocks?.electionTimeDay.map((et) => {
      et.value = round(et.value / 60, 0)
      return et
    })
    setElectionTimes(electionTimesArray)

    const blockTimeDayArray = blocks?.blockTimeDay.map((bt) => {
      bt.value = round(bt.value, 2)
      return bt
    })
    setBlockTimeDay(blockTimeDayArray)

    // const blockTimeWeekArray = blocks?.blockTimeWeek.map((bt) => {
    //   bt.value = round(bt.value, 2)
    //   return bt
    // })
    // setBlockTimeWeek(blockTimeWeekArray)

    // const blockTimeMonthArray = blocks?.blockTimeMonth.map((bt) => {
    //   bt.value = round(bt.value, 2)
    //   return bt
    // })
    // setBlockTimeMonth(blockTimeMonthArray)
    setProcessingData(false)
  }, [blocks])

  return (
    <InfoBoxPaneContainer>
      <TrendWidget
        title="Transaction Rate"
        series={blocks?.txnRate}
        isLoading={!blocks}
        periodLabel={'Last 100 Blocks'}
      />
      <StatWidget
        title="Block Height"
        series={blocks?.height}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (1hr)"
        series={blockTimeDay}
        valueSuffix={' sec'}
        isLoading={processingData}
      />
      <TrendWidget
        title="Election Time (24hr)"
        series={electionTimes}
        valueSuffix=" min"
        isLoading={processingData}
        periodLabel={`${blocks?.electionTimeDay.length} days`}
      />
      {/* <StatWidget
        title="Block Time (7D)"
        series={blockTimeWeek}
        valueSuffix={' sec'}
        isLoading={processingData}
      />
      <StatWidget
        title="Block Time (30D)"
        series={blockTimeMonth}
        valueSuffix={' sec'}
        isLoading={processingData}
      /> */}
    </InfoBoxPaneContainer>
  )
}

export default BlockStatisticsPane
