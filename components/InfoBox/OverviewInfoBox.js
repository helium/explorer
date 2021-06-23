import { round, sumBy } from 'lodash'
import { useMemo } from 'react'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import HalveningCountdownWidget from '../Widgets/HalvingCountdownWidget'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import { formatLargeNumber } from '../../utils/format'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'
import { useMarket } from '../../data/market'
import { useStats } from '../../data/stats'
import { useDataCredits } from '../../data/datacredits'
import { useNetworkRewards } from '../../data/rewards'
import RewardsTrendWidget from '../Widgets/RewardsTrendWidget'

const OverviewInfoBox = () => {
  const { data: hotspots } = useApi('/metrics/hotspots')
  const { data: blocks } = useApi('/metrics/blocks')
  const { data: validators = [] } = useApi('/validators')
  const { market } = useMarket()
  const { stats } = useStats()
  const { dataCredits } = useDataCredits()
  const { rewards: networkRewards } = useNetworkRewards()

  const totalStaked = useMemo(() => sumBy(validators, 'stake') / 100000000, [
    validators,
  ])

  return (
    <InfoBox title="Helium Explorer">
      <InfoBoxPaneContainer>
        <TrendWidget
          title="Hotspots"
          series={hotspots?.count}
          isLoading={!hotspots}
          linkTo="/hotspots"
        />
        <StatWidget
          title="Block Height"
          series={blocks?.height}
          isLoading={!blocks}
          linkTo="/blocks"
        />
        <Widget
          title="Market Price"
          tooltip="Based on data provided by CoinGecko"
          value={<Currency value={market?.price} />}
          change={round(market?.priceChange, 2)}
          changeSuffix="%"
          isLoading={!market}
          linkTo="/market"
        />
        <Widget
          title="DC Spent (30d)"
          tooltip="Data Credits are spent for transaction fees and to send data over the Helium Network. HNT are burned to create DC."
          value={
            (Math.abs(Number(dataCredits?.totalMonth)) / 1.0e9).toFixed(2) +
            ' bn'
          }
          change={(dataCredits?.totalMonth * 0.00001).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          isLoading={!stats}
          linkTo="/market"
        />
        <Widget
          title="HNT Staked"
          tooltip="The amount of HNT being staked by Validators"
          value={formatLargeNumber(totalStaked)}
          change={<Currency value={market?.price * 0} />}
          isLoading={!market}
          linkTo="/validators"
        />
        <HalveningCountdownWidget />
        <Widget
          title="Total Beacons"
          value={stats?.challenges?.toLocaleString()}
          isLoading={!stats}
          linkTo="/beacons"
        />
        <Widget
          title="Total Validators"
          value={validators.length.toLocaleString()}
          isLoading={!validators}
          linkTo="/validators"
        />
        <RewardsTrendWidget
          title="Network Rewards"
          series={networkRewards}
          showTarget
        />
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default OverviewInfoBox
