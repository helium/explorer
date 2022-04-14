import TrendWidget from '../../Widgets/TrendWidget'
import StatWidget from '../../Widgets/StatWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { round } from 'lodash'
import { useState, useEffect } from 'react'
import ElectionTimeWidget from '../../Widgets/ElectionTimeWidget'

const BlockStatisticsPane = () => {
  let { data: blocks } = useApi('/metrics/blocks')

  const [processingData, setProcessingData] = useState(true)
  const [blockTimeDay, setBlockTimeDay] = useState()
  // const [blockTimeWeek, setBlockTimeWeek] = useState()
  // const [blockTimeMonth, setBlockTimeMonth] = useState()

  useEffect(() => {
    if (!!blocks) {
      setProcessingData(true)
      const blockTimeDayArray = blocks?.blockTimeDay?.map((bt) => {
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
    }
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
        linkTo={
          blocks?.height?.length
            ? `/blocks/${blocks.height[blocks.height.length - 1].value}`
            : '/blocks'
        }
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (24hr)"
        series={blockTimeDay}
        valueSuffix={' sec'}
        changeInitial="second_last"
        changeSuffix={' sec'}
        isLoading={processingData}
      />
      <ElectionTimeWidget />
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
