import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography } from 'antd'
import { fetchMarket, useMarket } from '../data/market'
import { fetchStats, useStats } from '../data/stats'
import dynamic from 'next/dynamic'

const MiniCoverageMap = dynamic(
  () => import('../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const { Title } = Typography

const Index = ({ market: initialMarket, stats: initialStats }) => {
  const { market } = useMarket(initialMarket)
  const { stats } = useStats(initialStats)

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          background: '#27284B',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container"
        >
          <div className="flex-responsive">
            <Title
              style={{
                margin: '0px 0 40px',
                maxWidth: 550,
                letterSpacing: '-2px',
                fontSize: 38,
                lineHeight: 1,
                color: 'white',
              }}
            >
              Helium <span style={{ fontWeight: 300 }}>Explorer</span>
            </Title>
          </div>

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

          {/*<div style={{ position: 'relative', width: '100%' }}>
            <BarChart />
          </div>*/}
        </div>
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        <div style={{ background: 'white', padding: 15 }}>
          <h2 style={{ marginTop: 20 }}>Latest Blocks</h2>
        </div>
        <BlocksList />
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const [market, stats] = await Promise.all([fetchMarket(), fetchStats()])

  return {
    props: {
      market,
      stats,
    },
    revalidate: 10,
  }
}

export default Index
