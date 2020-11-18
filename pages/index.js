import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography } from 'antd'
import dynamic from 'next/dynamic'
import { fetchHotspots } from '../data/hotspots'

const MiniCoverageMap = dynamic(
  () => import('../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const { Title } = Typography

function Index(props) {
  const {
    price,
    priceChange,
    volume,
    height,
    circulatingSupply,
    marketCap,
    blockTime,
    electionTime,
    dataCredits,
    totalHotspots,
    hotspots,
  } = props

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
                  {height.toLocaleString()}
                </p>
                <p className="stat">
                  <span>Total Hotspots:</span>
                  {totalHotspots.toLocaleString()}
                </p>
                <p className="stat">
                  <span>LongFi data (30d):</span>
                  {((dataCredits * 24) / 10e8).toLocaleString()} GB
                </p>
                <p className="stat">
                  <span>Avg Election Time (24hr):</span>
                  {Math.floor(electionTime / 60)}m
                </p>
                <p className="stat">
                  <span>Avg Block Time (24hr):</span>
                  {Math.round(blockTime * 10) / 10}s
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
                  {price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}{' '}
                  ({priceChange > 0 ? '+' : ''}
                  {priceChange.toLocaleString()}%)
                </p>
                <p className="stat">
                  <span>Volume (24hr):</span>
                  {volume.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="stat">
                  <span>Circulating Supply:</span>
                  {circulatingSupply.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{' '}
                  HNT
                </p>
                <p className="stat">
                  <span>Data Credits spent (30d):</span>
                  {dataCredits.toLocaleString()} DC
                </p>
                <p className="stat">
                  <span>Market Cap:</span>
                  {marketCap.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
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
                  <MiniCoverageMap
                    zoomLevel={0.65}
                    hotspots={hotspots}
                    hotspotsLoading={false}
                  />
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
  let props = {}
  await fetch('https://api.coingecko.com/api/v3/coins/helium')
    .then((res) => res.json())
    .then((marketData) => {
      let newVolume = 0
      marketData.tickers.forEach((t) => {
        newVolume += t.converted_volume.usd
      })
      props = {
        ...props,
        volume: newVolume,
        price: marketData.market_data.current_price.usd,
        priceChange: marketData.market_data.price_change_percentage_24h,
      }
    })

  await fetch('https://api.helium.io/v1/stats')
    .then((res) => res.json())
    .then((stats) => {
      const realCap = props.price * stats.data.token_supply
      props = {
        ...props,
        circulatingSupply: stats.data.token_supply,
        blockTime: stats.data.block_times.last_day.avg,
        electionTime: stats.data.election_times.last_day.avg,
        packetsTransferred:
          stats.data.state_channel_counts.last_month.num_packets,
        dataCredits: stats.data.state_channel_counts.last_month.num_dcs,
        totalHotspots: stats.data.counts.hotspots,
        marketCap: realCap,
      }
    })

  const newHotspots = await fetchHotspots()

  return {
    props: {
      hotspots: newHotspots,
      height: await fetch('https://api.helium.io/v1/blocks/height')
        .then((res) => res.json())
        .then((json) => json.data.height),
      ...props,
    },
    revalidate: 10,
  }
}

export default Index
