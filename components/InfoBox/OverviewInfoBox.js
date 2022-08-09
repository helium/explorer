import { round } from 'lodash'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import { formatLargeNumber } from '../../utils/format'
import Widget from '../Widgets/Widget'
import DaoWidget from '../Widgets/DaoWidget'
import Currency from '../Common/Currency'
import { useMarket } from '../../data/market'
import { useDataCredits } from '../../data/datacredits'
import { useValidatorStats } from '../../data/validators'
import { useStats } from '../../data/stats'
import StatWidget from '../Widgets/StatWidget'

const OverviewInfoBox = () => {
  const { data: hotspots } = useApi('/metrics/hotspots')
  const { stats: validatorStats } = useValidatorStats()
  const { data: mobileStats } = useApi('/metrics/cells')
  const { data: validatorMetrics } = useApi('/metrics/validators')
  const { market } = useMarket()
  const { stats: marketStats } = useStats()
  const { dataCredits } = useDataCredits()
  const { data: blocks } = useApi('/metrics/blocks')

  return (
    <InfoBox
      title={
        <div className="pt-4 lg:px-5 lg:pt-10">
          <span className="font-sans text-2xl font-light tracking-tight text-white md:text-3xl">
            Welcome to{' '}
            <p className="font-semibold leading-5">Helium Explorer</p>
          </span>
        </div>
      }
      description={
        <div className="w-full py-4 lg:px-5">
          <span className="font-sans text-lg font-light leading-tight tracking-tight text-white">
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
        <DaoWidget
          title="HNT"
          usdAmount={<Currency value={market?.price} />}
          marketCap={
            <Currency
              value={market?.price * marketStats?.circulatingSupply}
              isLarge
            />
          }
          icon="/images/hnt.svg"
          extra={
            <div className="flex items-center justify-between pr-8">
              <StatWidget
                title="Block Height"
                series={blocks?.height}
                isLoading={!blocks}
                transparent
              />
              <div className="h-16 border-l border-solid border-l-gray-400" />
              <StatWidget
                title="Validators Online"
                series={validatorMetrics?.count}
                isLoading={!validatorMetrics}
                transparent
              />
            </div>
          }
          linkTo="/validators"
        />
        <DaoWidget
          title="IOT"
          icon="/images/iot.svg"
          extra={
            <TrendWidget
              title="Hotspots"
              series={hotspots?.count}
              isLoading={!hotspots}
              transparent
            />
          }
          linkTo="/iot"
        />
        <DaoWidget
          title="MOBILE"
          icon="/images/mobile.svg"
          extra={
            <TrendWidget
              title="5G Radios"
              series={mobileStats?.count}
              isLoading={!mobileStats}
              transparent
            />
          }
          linkTo="/mobile"
        />
        <Widget
          title="HNT Market Price"
          tooltip={
            <span>
              Based on data provided by{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.coingecko.com/en/coins/helium"
              >
                CoinGecko
              </a>
            </span>
          }
          value={<Currency value={market?.price} />}
          change={round(market?.priceChange, 2)}
          changeSuffix="%"
          isLoading={!market}
          linkTo="/market"
        />
        <Widget
          title="HNT Market Cap"
          tooltip="Based on data provided by CoinGecko"
          value={
            <Currency
              value={market?.price * marketStats?.circulatingSupply}
              isLarge
            />
          }
          subtitle={
            <span className="text-gray-550">
              Vol: <Currency value={market?.volume} isLarge />
            </span>
          }
          isLoading={!market || !marketStats}
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
          linkTo="/iot"
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
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default OverviewInfoBox
