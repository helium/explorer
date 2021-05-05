import TrendWidget from '../../Widgets/TrendWidget'
import StatWidget from '../../Widgets/StatWidget'
import useSWR from 'swr'

const BlockStatisticsPane = () => {
  let { data: blocks } = useSWR('/api/metrics/blocks')
  blocks = { ...blocks, longFiData: [{ value: 2000 }, { value: 2010 }] }

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
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
    </div>
  )
}

export default BlockStatisticsPane
