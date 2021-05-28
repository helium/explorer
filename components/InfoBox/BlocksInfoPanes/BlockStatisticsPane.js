import TrendWidget from '../../Widgets/TrendWidget'
import StatWidget from '../../Widgets/StatWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const BlockStatisticsPane = () => {
  let { data: blocks } = useApi('/metrics/blocks')
  blocks = !!blocks
    ? { ...blocks, longFiData: [{ value: 2000 }, { value: 2010 }] }
    : undefined

  return (
    <InfoBoxPaneContainer>
      <TrendWidget
        title="Transaction Rate"
        series={blocks?.txnRate}
        isLoading={!blocks}
        periodLabel={'Last 100 Blocks'}
      />
      <StatWidget
        title="Election Time (24hr)"
        series={blocks?.electionTimeDay}
        isLoading={!blocks}
      />
      <StatWidget
        title="LongFi Data"
        series={blocks?.longFiData}
        suffix={'GB'}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Height"
        series={blocks?.height}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (1hr)"
        series={blocks?.blockTimeDay}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (7D)"
        series={blocks?.blockTimeWeek}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (30D)"
        series={blocks?.blockTimeMonth}
        isLoading={!blocks}
      />
    </InfoBoxPaneContainer>
  )
}

export default BlockStatisticsPane
