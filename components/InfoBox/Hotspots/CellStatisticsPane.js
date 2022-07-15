import TrendWidget from '../../Widgets/TrendWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import StatWidget from '../../Widgets/StatWidget'

const CellStatisticsPane = () => {
  const { data: stats } = useApi('/metrics/cells')

  return (
    <InfoBoxPaneContainer>
      <TrendWidget
        title="5G Hotspots"
        series={stats?.count}
        isLoading={!stats}
      />
      <StatWidget
        title="Indoor Radios"
        series={stats?.indoorCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Outdoor Radios"
        series={stats?.outdoorCount}
        isLoading={!stats}
      />
    </InfoBoxPaneContainer>
  )
}

export default CellStatisticsPane
