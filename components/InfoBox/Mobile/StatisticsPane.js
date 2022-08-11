import TrendWidget from '../../Widgets/TrendWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import StatWidget from '../../Widgets/StatWidget'

const StatisticsPane = () => {
  const { data: stats } = useApi('/metrics/cells')

  return (
    <InfoBoxPaneContainer>
      <TrendWidget title="5G Radios" series={stats?.count} isLoading={!stats} />
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
      <StatWidget
        title="Cities"
        series={stats?.citiesCount}
        isLoading={!stats}
      />
      <StatWidget
        title="States"
        series={stats?.statesCount}
        isLoading={!stats}
      />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
