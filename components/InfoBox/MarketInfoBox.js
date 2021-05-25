import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useMarket } from '../../data/market'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'
import { useStats } from '../../data/stats'
import { round } from 'lodash'
import { useOraclePrices } from '../../data/oracles'

const MarketInfoBox = () => {
  const { market } = useMarket()
  const { stats } = useStats()
  const { oraclePrices } = useOraclePrices()
  const [latestOraclePrice, priorOraclePrice] = oraclePrices || []

  return (
    <InfoBox title="Market">
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
            <Widget
              title="Market Price"
              value={<Currency value={market?.price} />}
              change={round(market?.priceChange, 2)}
              changeSuffix="%"
              isLoading={!market}
            />
            <Widget
              title="Oracle Price"
              value={<Currency value={latestOraclePrice?.price / 100000000} />}
              change={round(
                ((latestOraclePrice?.price - priorOraclePrice?.price) /
                  latestOraclePrice?.price) *
                  100,
                2,
              )}
              changeSuffix="%"
              isLoading={!oraclePrices}
            />
            <Widget title="Data Credit Price" value="$0.00001" />
            <Widget
              title="DC per HNT"
              value={(
                latestOraclePrice?.price /
                100000000 /
                0.00001
              ).toLocaleString()}
              isLoading={!oraclePrices}
            />
            <Widget
              title="Volume"
              value={<Currency value={market?.volume} isLarge />}
              isLoading={!market}
            />
            <Widget
              title="Circulating Supply"
              value={`${round(stats?.circulatingSupply / 1000000, 3)}M`}
              subtitle={<span className="text-gray-550">HNT</span>}
              isLoading={!stats}
            />
            <Widget
              title="Max Supply"
              value="223M"
              subtitle={<span className="text-gray-550">HNT</span>}
            />
            <Widget
              title="Market Cap"
              value={
                <Currency
                  value={market?.price * stats?.circulatingSupply}
                  isLarge
                />
              }
              isLoading={!market || !stats}
            />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default MarketInfoBox
