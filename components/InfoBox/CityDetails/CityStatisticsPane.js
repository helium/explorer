import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import Widget from '../../Widgets/Widget'
import SkeletonWidgets from '../Common/SkeletonWidgets'

const CityStatisticsPane = ({ city }) => {
  if (!city) return <SkeletonWidgets />
  return (
    <InfoBoxPaneContainer>
      <Widget
        value={city.hotspotCount.toLocaleString()}
        title="Total Hotspots in City"
        subtitle={`${(
          (city.onlineCount / city.hotspotCount) *
          100
        ).toLocaleString(undefined, { maximumFractionDigits: 2 })}% online`}
        span={2}
      />
      <Widget
        value={city.onlineCount.toLocaleString()}
        title="Online Hotspots"
      />
      <Widget
        value={city.offlineCount.toLocaleString()}
        title="Offline Hotspots"
      />
    </InfoBoxPaneContainer>
  )
}

export default CityStatisticsPane
