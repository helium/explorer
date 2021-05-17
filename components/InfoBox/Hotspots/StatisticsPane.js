import { useMemo } from 'react'
import useSWR from 'swr'
import StatWidget from '../../Widgets/StatWidget'
import TrendWidget from '../../Widgets/TrendWidget'
import { useLatestHotspots } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'

const StatisticsPane = () => {
  const { data: stats } = useSWR(
    'https://explorer-api.helium.com/api/metrics/hotspots',
  )
  const { latestHotspots } = useLatestHotspots()

  const latestHotspot = useMemo(() => {
    if (!latestHotspots) return null
    return latestHotspots.find((h) => !!h.location)
  }, [latestHotspots])

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
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
      <HotspotWidget title="Latest Hotspot" hotspot={latestHotspot} />
    </div>
  )
}

export default StatisticsPane
