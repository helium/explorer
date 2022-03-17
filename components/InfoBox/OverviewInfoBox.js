import { round } from 'lodash'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
// import HalveningCountdownWidget from '../Widgets/HalvingCountdownWidget'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import { formatLargeNumber } from '../../utils/format'
import Widget from '../Widgets/Widget'
import Currency from '../Common/Currency'
import { useMarket } from '../../data/market'
import { useStats } from '../../data/stats'
import { useDataCredits } from '../../data/datacredits'
import { useValidatorStats } from '../../data/validators'

const OverviewInfoBox = () => {
  const { data: hotspots } = useApi('/metrics/hotspots')
  const { data: blocks } = useApi('/metrics/blocks')
  const { stats: validatorStats } = useValidatorStats()
  const { market } = useMarket()
  const { stats } = useStats()
  const { dataCredits } = useDataCredits()

  return (
    <InfoBox
      title={
        <div className="pt-4 lg:pt-10 lg:px-5">
          <span className="text-white text-2xl md:text-3xl font-light font-sans tracking-tight">
            Welcome to{' '}
            <p className="font-semibold leading-5">Helium Explorer</p>
          </span>
        </div>
      }
      description={
        <div className="w-full py-4 lg:px-5">
          <span className="text-white font-sans font-light text-lg tracking-tight leading-tight">
            Helium Explorer is a Block Explorer and Analytics Platform for{' '}
            <a
              href="https://helium.com"
              rel="noopener noreferrer"
              target="_blank"
              className="text-green-450 underline"
            >
              Helium
            </a>
            , a decentralized wireless connectivity platform.
          </span>
        </div>
      }
    >
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
          change={<Currency value={dataCredits?.totalMonth * 0.00001} />}
          isLoading={!dataCredits}
          linkTo="/market"
        />
        <Widget
          title="HNT Staked"
          tooltip="The amount of HNT being staked by Validators"
          value={formatLargeNumber(validatorStats?.staked?.amount)}
          change={
            <Currency value={market?.price * validatorStats?.staked?.amount} />
          }
          isLoading={!market || !validatorStats}
          linkTo="/validators"
        />
        {/* <HalveningCountdownWidget /> */}
        <Widget
          title="Total Beacons"
          value={stats?.challenges?.toLocaleString()}
          isLoading={!stats}
          linkTo="/beacons"
        />
        <Widget
          title="Staked Validators"
          value={validatorStats?.staked?.count?.toLocaleString()}
          isLoading={!validatorStats}
          linkTo="/validators"
        />
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default OverviewInfoBox
