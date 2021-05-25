import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useMarket } from '../../data/market'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'

const MarketInfoBox = () => {
  const { market, isLoading } = useMarket()
  console.log('market', market)

  return (
    <InfoBox title="Market">
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
            <Widget
              title="Market Price"
              value={<Currency value={market.price} />}
              change={market.priceChange}
              isLoading={isLoading}
            />
            <Widget
              title="Volume"
              value={<Currency value={market.volume} isLarge />}
              isLoading={isLoading}
            />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default MarketInfoBox
