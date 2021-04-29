import { useMemo } from 'react'
import useSWR from 'swr'
import FlagLocation from '../../Common/FlagLocation'
import { formatHotspotName } from '../../Hotspots/utils'
import StatWidget from '../../Widgets/StatWidget'
import TrendWidget from '../../Widgets/TrendWidget'
import Widget from '../../Widgets/Widget'
import { useLatestHotspots } from '../../../data/hotspots'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'

const StatisticsPane = () => {
  const { data: stats } = useSWR('/api/metrics/hotspots')
  const { latestHotspots } = useLatestHotspots()

  const latestHotspot = useMemo(() => {
    if (!latestHotspots) return null
    return latestHotspots.find((h) => !!h.location)
  }, [latestHotspots])

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
      <TrendWidget title="Hotspots" series={stats?.count} isLoading={!stats} />
      <StatWidget
        title="% Online"
        series={stats?.onlinePct}
        isLoading={!stats}
        valueType="percent"
        changeType="percent"
      />
      <StatWidget
        title="Hotspot Owners"
        series={stats?.ownersCount}
        isLoading={!stats}
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
      <LatestHotspotWidget hotspot={latestHotspot} />
      <div className="col-span-2 pb-1" />
    </div>
  )
}

const LatestHotspotWidget = ({ hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return null

  return (
    <Widget
      title="Latest Hotspot"
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      onClick={() => selectHotspot(hotspot.address)}
      isLoading={!hotspot}
    />
  )
}

export default StatisticsPane
