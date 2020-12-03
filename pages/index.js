import React from 'react'
import { Row, Col, Typography } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { fetchMarket, useMarket } from '../data/market'
import { fetchStats, useStats } from '../data/stats'
import { fetchOraclePrices, useOraclePrices } from '../data/oracles'
import dynamic from 'next/dynamic'
import OraclePriceChart from '../components/Oracles/OraclePriceChart'
import OracleImg from '../public/images/oracle.svg'
import Widget from '../components/Home/Widget'
import round from 'lodash/round'
import TopChart from '../components/AppLayout/TopChart'
import TopBanner from '../components/AppLayout/TopBanner'
import { getUnixTime, formatDistanceToNow } from 'date-fns'
import HalvingCountdown from '../components/Home/HalvingCountdown'

const MiniCoverageMap = dynamic(
  () => import('../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const { Title, Text } = Typography

const Index = ({
  market: initialMarket,
  stats: initialStats,
  oraclePrices: initialOraclePrices,
}) => {
  const { market } = useMarket(initialMarket)
  const { stats } = useStats(initialStats)
  const { oraclePrices } = useOraclePrices(initialOraclePrices)

  const latestOraclePrice = (oraclePrices[0].price / 100000000).toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    },
  )

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          background: '#F4F5F7',
        }}
      >
        <TopBanner>
          Welcome to
          <br />
          <span style={{ fontWeight: 600, color: '#32C48D' }}>
            Helium Explorer
          </span>
        </TopBanner>

        <TopChart
          title="Oracle Price (30d)"
          subtitle={`${latestOraclePrice} (${formatDistanceToNow(
            new Date(oraclePrices[0].timestamp),
            {
              addSuffix: true,
            },
          )})`}
          icon={OracleImg}
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
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container"
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Widget
                title="Total Hotspots"
                value={stats.totalHotspots.toLocaleString()}
                tooltip="The Helium network is made up of thousands of hotspots providing coverage around the globe"
                footer="View Hotspots"
                href="/hotspots"
              />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Block Time"
                value={`${round(stats.blockTimes.lastHour.avg)} secs`}
                change={
                  round(stats.blockTimes.lastHour.avg) -
                  round(stats.blockTimes.lastDay.avg)
                }
                changeSuffix=" secs"
                changeUpIsBad
                tooltip="The target block time is 60 secs. The network will adjust up or down to maintain this target."
                footer="View Blocks"
                href="/blocks"
              />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Current Price"
                value={market.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}
                change={market.priceChange}
                changeSuffix="%"
                changePrecision={1}
                tooltip="Based on data provided by CoinGecko"
                footer="View Market Data"
                href="/market"
              />
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            <Col xs={24} md={24}>
              <HalvingCountdown />
            </Col>
          </Row>

          <div
            style={{
              background: '#3F416D',
              borderRadius: 10,
            }}
            className="summary-header"
          >
            <Row>
              <Col lg={12}>
                <h3
                  style={{
                    marginBottom: 20,
                    color: '#1890ff',
                    fontSize: 14,
                  }}
                >
                  Blockchain Stats
                </h3>
                <p className="stat">
                  <span>Block Height:</span>
                  {stats.totalBlocks.toLocaleString()}
                </p>
                <p className="stat">
                  <span>Total Hotspots:</span>
                  {stats.totalHotspots.toLocaleString()}
                </p>
                <p className="stat">
                  <span>LongFi data (30d):</span>
                  {((stats.dataCredits * 24) / 10e8).toLocaleString()} GB
                </p>
                <p className="stat">
                  <span>Avg Election Time (24hr):</span>
                  {Math.floor(stats.electionTime / 60)}m
                </p>
                <p className="stat">
                  <span>Avg Block Time (24hr):</span>
                  {Math.round(stats.blockTime * 10) / 10}s
                </p>
              </Col>

              <Col lg={12}>
                <h3
                  style={{
                    marginBottom: 20,
                    color: '#1890ff',
                    fontSize: 14,
                  }}
                >
                  Market Stats
                </h3>
                <p className="stat">
                  <span>Market Price</span>
                  {market.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}{' '}
                  ({market.priceChange > 0 ? '+' : ''}
                  {market.priceChange.toLocaleString()}%)
                </p>
                <p className="stat">
                  <span>Volume (24hr):</span>
                  {market.volume.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="stat">
                  <span>Circulating Supply:</span>
                  {stats.circulatingSupply.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  HNT
                </p>
                <p className="stat">
                  <span>Maximum Supply:</span>
                  223,000,000 HNT
                </p>
                <p className="stat">
                  <span>Data Credits spent (30d):</span>
                  {stats.dataCredits.toLocaleString()} DC
                </p>
                <p className="stat">
                  <span>Market Cap:</span>
                  {(market.price * stats.circulatingSupply).toLocaleString(
                    'en-US',
                    {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    },
                  )}
                </p>
              </Col>
            </Row>
            {/* <div className="flex-responsive"> */}
            <Row>
              <Col lg={12}>
                <h3
                  style={{
                    marginBottom: 0,
                    color: '#1890ff',
                    fontSize: 14,
                  }}
                >
                  Coverage Map
                </h3>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <a href="/coverage">
                  <MiniCoverageMap zoomLevel={0.65} />
                </a>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </AppLayout>
  )
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

export default Index
