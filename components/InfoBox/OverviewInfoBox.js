import { round } from 'lodash'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import HalveningCountdownWidget from '../Widgets/HalvingCountdownWidget'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'
import { useMarket } from '../../data/market'
import { useStats } from '../../data/stats'

const OverviewInfoBox = () => {
  const { data: hotspots } = useApi('/metrics/hotspots')
  const { data: blocks } = useApi('/metrics/blocks')
  const { data: validators = [] } = useApi('/validators')
  const { market } = useMarket()
  const { stats } = useStats()

  return (
    <InfoBox title="Helium Explorer">
      <TabNavbar>
        <TabPane title="Overview" key="1">
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
          </InfoBoxPaneContainer>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default OverviewInfoBox
