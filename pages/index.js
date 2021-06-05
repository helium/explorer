import React from 'react'
import { Row, Col, Card, Button } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { fetchDataCredits, useDataCredits } from '../data/datacredits'
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
import BlocksList from '../components/BlocksList'
import Link from 'next/link'

const MiniCoverageMap = dynamic(
  () => import('../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const Index = ({
  market: initialMarket,
  stats: initialStats,
  dataCredits: initialDatacredits,
  oraclePrices: initialOraclePrices,
}) => {
  const { market } = useMarket(initialMarket)
  const { stats } = useStats(initialStats)
  const { dataCredits } = useDataCredits(initialDatacredits)
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
      <TopBanner
        title={
          <span>
            Welcome to
            <br />
            <span style={{ fontWeight: 600, color: '#32C48D' }}>
              Helium Explorer
            </span>
          </span>
        }
      />
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
          marginTop: 0,
          background: '#F4F5F7',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container"
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Widget
                title="Hotspots"
                value={stats.totalHotspots.toLocaleString()}
                tooltip="The Helium network is made up of thousands of hotspots providing coverage around the globe"
                footer="View Hotspots"
                href="/hotspots"
              />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Blocks"
                value={stats.totalBlocks.toLocaleString()}
                footer="View Blocks"
                href="/blocks"
              />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Consensus Groups"
                value={stats.consensusGroups.toLocaleString()}
                footer="View Consensus Groups"
                href="/consensus"
              />
            </Col>
          </Row>
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              marginBottom: 20,
              paddingBottom: 30,
            }}
            className="ant-card-head"
          >
            <Row>
              <Col lg={12}>
                <div class="ant-card-head-title">Hotspot Map</div>
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
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Widget
                title="Election Times (24h)"
                value={`${round(stats.electionTimes.lastDay.avg / 60, 1)} min`}
                change={
                  round(stats.electionTimes.lastHour.avg / 60) -
                  round(stats.electionTimes.lastDay.avg / 60)
                }
                changeSuffix=" min"
                changeUpIsBad
                footer="View Consensus Groups"
                href="/consensus"
              />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Block Time"
                value={`${round(stats.blockTimes.lastHour.avg)} sec`}
                change={
                  round(stats.blockTimes.lastHour.avg) -
                  round(stats.blockTimes.lastDay.avg)
                }
                changeSuffix=" sec"
                changeUpIsBad
                tooltip="The target block time is 60 sec. The network will adjust up or down to maintain this target."
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
                  minimumFractionDigits: 2,
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
            <Col xs={24} md={16}>
              <HalvingCountdown />
            </Col>
            <Col xs={24} md={8}>
              <Widget
                title="Data Credits Spent (7d)"
                value={
                  (Math.abs(Number(dataCredits.totalWeek)) / 1.0e9).toFixed(2) +
                  'B'
                }
                subtitle={(dataCredits.totalWeek * 0.00001).toLocaleString(
                  'en-US',
                  {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
                tooltip="Data credits are spent for transaction fees and to send data over the Helium Network. HNT are burned to create DC."
                footer="View Market Data"
                href="/market"
              />
            </Col>
          </Row>
          <Card title="Latest Blocks" style={{ marginBottom: 60 }}>
            <BlocksList pageSize={10} showButton={false} />
            <Row justify="center" style={{ padding: '20px 0' }}>
              <Link href="/blocks">
                <a>
                  <Button
                    size="large"
                    style={{
                      backgroundColor: '#5850EB',
                      color: 'white',
                      borderRadius: 6,
                    }}
                  >
                    View All Blocks
                  </Button>
                </a>
              </Link>
            </Row>
          </Card>
        </div>
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const [market, stats, dataCredits, oraclePrices] = await Promise.all([
    fetchMarket(),
    fetchStats(),
    fetchDataCredits(),
    fetchOraclePrices(),
  ])

  return {
    props: {
      market,
      stats,
      dataCredits,
      oraclePrices,
    },
    revalidate: 10,
  }
}

export default Index
