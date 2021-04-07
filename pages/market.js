import React from 'react'
import { Row, Col } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { fetchMarket, useMarket } from '../data/market'
import { fetchStats, useStats } from '../data/stats'
import { fetchOraclePrices, useOraclePrices } from '../data/oracles'
import TopChart from '../components/AppLayout/TopChart'
import TopBanner from '../components/AppLayout/TopBanner'
import OracleImg from '../public/images/oracle.svg'
import OraclePriceChart from '../components/Oracles/OraclePriceChart'
import Widget from '../components/Home/Widget'
import TokenImg from '../public/images/token.svg'
import round from 'lodash/round'
import { getUnixTime, formatDistanceToNow } from 'date-fns'

function Market({
  market: initialMarket,
  stats: initialStats,
  oraclePrices: initialOraclePrices,
}) {
  const { market } = useMarket(initialMarket)
  const { stats } = useStats(initialStats)
  const { oraclePrices } = useOraclePrices(initialOraclePrices)

  const latestOraclePrice = (oraclePrices[0].price / 100000000).toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )

  return (
    <AppLayout
      title={'Market Data'}
      description={
        'An overview of market data about the Helium Network Token (HNT) and Data Credits (DC)'
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/market.png`}
      url={`https://explorer.helium.com/market`}
    >
      <TopBanner icon={TokenImg} title="Market Data" />

      <TopChart
        title="Oracle Price (30d)"
        subtitle={`${latestOraclePrice} (${formatDistanceToNow(
          new Date(oraclePrices[0].timestamp),
          {
            addSuffix: true,
          },
        )})`}
        icon={OracleImg}
        tooltip="The Oracle Price is the price used for on-chain burn transactions. Derived from the market price, Oracles submit prices periodically to stabilize market fluctuations"
        chart={
          <OraclePriceChart
            data={oraclePrices
              .map(({ timestamp, price }) => ({
                time: getUnixTime(new Date(timestamp)),
                price: price / 100000000,
              }))
              .reverse()}
          />
        }
      />

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          padding: '40px 10px 100px',
        }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <Widget
              title="Market Price"
              value={market.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
              change={market.priceChange}
              changeSuffix="%"
              changePrecision={1}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Oracle Price"
              value={latestOraclePrice}
              change={
                ((oraclePrices[0].price - oraclePrices[1].price) /
                  oraclePrices[1].price) *
                100
              }
              changePrecision={2}
              changeSuffix="%"
              tooltip="The Oracle price is used to determine how many DC are produced when burning HNT"
              footer="Learn more about Oracles"
              href="https://docs.helium.com/blockchain/oracles"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Data Credit Price"
              value="$0.00001"
              change="fixed"
              changeIsAmbivalent
              tooltip="Data Credits are fixed at $0.00001 USD. The Oracle price is used to compute how much HNT to burn."
              footer="Learn more about DC"
              href="https://docs.helium.com/blockchain/helium-token/#data-credits-and-burn-and-mint-economics"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="DC per HNT"
              value={(
                oraclePrices[0].price /
                100000000 /
                0.00001
              ).toLocaleString()}
              tooltip="DC are used to transmit or receive 24 bytes of data over the Helium Network"
              footer="Learn more about Devices"
              href="https://docs.helium.com/use-the-network/devices"
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <Widget
              title="Circulating Supply"
              value={`${round(
                stats.circulatingSupply / 1000000,
                1,
              ).toLocaleString()}M HNT`}
              tooltip={`${round(
                stats.circulatingSupply,
              ).toLocaleString()} HNT is currently in circulation`}
              changeIsAmbivalent
              footer="View external source"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Max Supply"
              value="223M HNT"
              tooltip="There is an effective cap of 223M HNT due to reward halvings every 2 years"
              footer="Learn more"
              href="https://blog.helium.com/hip-20-on-hnt-max-supply-approved-by-the-community-fca15a161a80"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Volume (24h)"
              value={market.volume.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Market Cap"
              value={marketCapString(market.price, stats.circulatingSupply)}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
        </Row>
      </Content>
    </AppLayout>
  )
}

const marketCapString = (price, supply) => {
  const cap = price * supply

  const BILLION = 1_000_000_000
  const MILLION = 1_000_000

  if (cap >= BILLION) {
    return ['$', round(cap / BILLION, 3), 'B'].join('')
  }

  return ['$', round(cap / MILLION, 3), 'M'].join('')
}

export async function getStaticProps() {
  const [market, stats, oraclePrices] = await Promise.all([
    fetchMarket(),
    fetchStats(),
    fetchOraclePrices(),
  ])

  return {
    props: {
      market,
      stats,
      oraclePrices,
    },
    revalidate: 10,
  }
}

export default Market
