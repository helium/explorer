import { useMemo } from 'react'
import StatWidget from '../../Widgets/StatWidget'
import TrendWidget from '../../Widgets/TrendWidget'
import { useLatestHotspots } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'
import useApi from '../../../hooks/useApi'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import Widget from '../../Widgets/Widget'
import { maxBy, last } from 'lodash'
import { useDataCredits } from '../../../data/datacredits'
import LargeBalance from '../../Common/LargeBalance'

const StatisticsPane = () => {
  const { data: stats } = useApi('/metrics/hotspots')
  const { data: makers } = useApi('/makers')
  const { latestHotspots } = useLatestHotspots()
  const { dataCredits } = useDataCredits()

  const latestHotspot = useMemo(() => {
    if (!latestHotspots) return null
    return latestHotspots.find((h) => !!h.location)
  }, [latestHotspots])

  const challengeeSubtitle = useMemo(() => {
    const totalHotspots = last(stats?.count)?.value
    const hotspotsOnlinePct = last(stats?.onlinePct)?.value
    const challengeesPerWeek = last(stats?.challengeesWeekCount)?.value

    if (!totalHotspots || !hotspotsOnlinePct || !challengeesPerWeek) return ''

    const onlineHotspots = Math.trunc(totalHotspots * hotspotsOnlinePct)
    const percent = (challengeesPerWeek / onlineHotspots) * 100

    if (percent === Infinity) return ''

    return `${percent.toFixed(2)}% of Online Hotspots`
  }, [stats])

  return (
    <InfoBoxPaneContainer>
      <TrendWidget title="Hotspots" series={stats?.count} isLoading={!stats} />
      <TrendWidget
        title="Data-Only Hotspots"
        series={stats?.dataOnlyCount}
        isLoading={!stats}
      />
      <Widget
        title="Messages Sent (24h)"
        value={<LargeBalance value={dataCredits?.lastDay?.stateChannel} />}
        isLoading={!dataCredits}
      />
      <Widget
        title="Messages Sent (30d)"
        value={<LargeBalance value={dataCredits?.lastMonth?.stateChannel} />}
        isLoading={!dataCredits}
      />
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
        linkTo="/iot/makers"
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
        title="Hotspots that have been Rewarded (24H)"
        series={stats?.rewardedCount}
        isLoading={!stats}
        changeInitial="second_last"
      />
      <StatWidget
        title="Hotspots that have Witnessed (24H)"
        series={stats?.witnessesCount}
        isLoading={!stats}
        changeInitial="second_last"
      />
      <StatWidget
        title="Hotspots that have Beaconed (7D)"
        series={stats?.challengeesWeekCount}
        isLoading={!stats}
        changeInitial="second_last"
        subtitle={
          <div className={'text-sm font-medium text-green-500'}>
            {challengeeSubtitle}
          </div>
        }
        span={2}
      />
      <HotspotWidget title="Latest Hotspot" hotspot={latestHotspot} />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
