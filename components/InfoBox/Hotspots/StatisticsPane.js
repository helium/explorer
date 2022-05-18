import { useMemo } from 'react'
import StatWidget from '../../Widgets/StatWidget'
import TrendWidget from '../../Widgets/TrendWidget'
import { useLatestHotspots } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import Widget from '../../Widgets/Widget'
import { maxBy } from 'lodash'

const StatisticsPane = () => {
  const { data: stats } = useApi('/metrics/hotspots')
  const { data: makers } = useApi('/makers')
  const { latestHotspots } = useLatestHotspots()

  const latestHotspot = useMemo(() => {
    if (!latestHotspots) return null
    return latestHotspots.find((h) => !!h.location)
  }, [latestHotspots])

  return (
    <InfoBoxPaneContainer>
      <TrendWidget title="Hotspots" series={stats?.count} isLoading={!stats} />
      <StatWidget
        title="% Online"
        series={stats?.onlinePct}
        isLoading={!stats}
        valueType="percent"
        changeType="percent"
      />
      <Widget
        title="Makers"
        value={makers?.length}
        subtitle={`Latest: ${maxBy(makers, 'id')?.name}`}
        isLoading={!makers}
        linkTo="/hotspots/makers"
      />
      <StatWidget
        title="Cities"
        series={stats?.citiesCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Countries"
        series={stats?.countriesCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Data-Only Hotspots"
        series={stats?.dataOnlyCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Hotspots that have been Rewarded (24H)"
        series={stats?.rewardedCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Hotspots that have Witnessed (24H)"
        series={stats?.witnessesCount}
        isLoading={!stats}
      />
      <StatWidget
        title="Hotspots that have Beaconed (24H)"
        series={stats?.challengeesCount}
        isLoading={!stats}
      />
      <HotspotWidget title="Latest Hotspot" hotspot={latestHotspot} />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
