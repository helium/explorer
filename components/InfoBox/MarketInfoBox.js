import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useMarket } from '../../data/market'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'
import { useStats } from '../../data/stats'
import { round } from 'lodash'
import { useOraclePrices } from '../../data/oracles'
import TrendWidget from '../Widgets/TrendWidget'
import RewardsTrendWidget from '../Widgets/RewardsTrendWidget'
import { useNetworkRewards } from '../../data/rewards'

const MarketInfoBox = () => {
  const { market } = useMarket()
  const { stats } = useStats()
  const { oraclePrices } = useOraclePrices()
  const [latestOraclePrice] = oraclePrices || []
  const { rewards: networkRewards } = useNetworkRewards()

  return (
    <InfoBox title="Market" metaTitle="Market">
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
            <TrendWidget
              title="Oracle Price"
              tooltip="Oracle price is used to determine how many DC are produced when burning HNT"
              series={oraclePrices
                ?.map((oraclePrice) => ({
                  value: oraclePrice.price / 100000000,
                }))
                ?.reverse()}
              locale="en-US"
              toLocaleStringOpts={{
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
              changeType="percent"
              periodLabel="30 Day Trend"
              isLoading={!oraclePrices}
            />
            <Widget
              title="Market Price"
              tooltip="Based on data provided by CoinGecko"
              value={<Currency value={market?.price} />}
              change={round(market?.priceChange, 2)}
              changeSuffix="%"
              isLoading={!market}
            />
            <Widget
              title="Market Cap"
              tooltip="Based on data provided by CoinGecko"
              value={
                <Currency
                  value={market?.price * stats?.circulatingSupply}
                  isLarge
                />
              }
              subtitle={
                <span className="text-gray-550">
                  Vol: <Currency value={market?.volume} isLarge />
                </span>
              }
              isLoading={!market || !stats}
            />
            <RewardsTrendWidget
              title="Network Rewards"
              series={networkRewards}
              showTarget
              periodLabel="30 Day Trend"
            />
            <Widget
              title="Circulating Supply"
              tooltip={`${round(
                stats?.circulatingSupply,
              ).toLocaleString()} HNT currently in circulation`}
              value={`${round(stats?.circulatingSupply / 1000000, 3)}M`}
              subtitle={<span className="text-gray-550">HNT</span>}
              isLoading={!stats}
            />
            <Widget
              title="Max Supply"
              tooltip="There is an effective cap of 223M HNT due to reward halvings every 2 years"
              value="223M"
              subtitle={<span className="text-gray-550">HNT</span>}
            />
            <Widget
              title="Data Credit Price"
              tooltip="Data Credits are fixed at $0.00001 USD. Oracle price is used to compute how much HNT to burn."
              value="$0.00001"
              subtitle={<span className="text-gray-550">fixed</span>}
            />
            <Widget
              title="DC per HNT"
              tooltip="DC are used to transmit or receive 24 bytes of data over the Helium Network"
              value={(
                latestOraclePrice?.price /
                100000000 /
                0.00001
              ).toLocaleString()}
              isLoading={!oraclePrices}
            />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default MarketInfoBox
