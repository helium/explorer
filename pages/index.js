import React from 'react'
import { Row, Col } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography } from 'antd'
import { fetchMarket, useMarket } from '../data/market'
import { fetchStats, useStats } from '../data/stats'
import dynamic from 'next/dynamic'
import OraclePriceChart from '../components/Oracles/OraclePriceChart'
import OracleImg from '../public/images/oracle.svg'
import Widget from '../components/Home/Widget'
import round from 'lodash/round'

const MiniCoverageMap = dynamic(
  () => import('../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const { Title, Text } = Typography

const Index = ({ market: initialMarket, stats: initialStats }) => {
  const { market } = useMarket(initialMarket)
  const { stats } = useStats(initialStats)

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          background: '#F4F5F7',
        }}
      >
        <div style={{ backgroundColor: '#101725' }}>
          <div style={{ padding: '40px 0px 40px 40px' }}>
            <Title
              style={{
                margin: '0px 0 40px',
                maxWidth: 550,
                letterSpacing: '-2px',
                fontSize: 38,
                lineHeight: 1,
                color: 'white',
                fontWeight: 300,
              }}
            >
              Welcome to
              <br />
              <span style={{ fontWeight: 600, color: '#32C48D' }}>
                Helium Explorer
              </span>
            </Title>
          </div>
        </div>
        <div style={{ backgroundColor: '#161E2E' }}>
          <div style={{ padding: '40px 0 0 40px' }}>
            <Row justify="middle" gutter={[0, 16]}>
              <img src={OracleImg} style={{ marginRight: 4 }} />
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                Oracle Price (30d)
              </Title>
            </Row>
            <Text style={{ color: '#717E98' }}>$1.42 USD</Text>
          </div>
          <OraclePriceChart
            data={prices.map(([time, price]) => ({ time: time / 1000, price }))}
          />
        </div>
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container"
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Widget
                title="Total Hotspots"
                value={stats.totalHotspots.toLocaleString()}
                change={0}
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
  const [market, stats] = await Promise.all([fetchMarket(), fetchStats()])

  return {
    props: {
      market,
      stats,
    },
    revalidate: 10,
  }
}

const prices = [
  [1599177600000, 1.6657153071553181],
  [1599264000000, 1.525976856991492],
  [1599350400000, 1.3956832610247296],
  [1599436800000, 1.216476625322134],
  [1599523200000, 1.257737331769467],
  [1599609600000, 1.3439880435159897],
  [1599696000000, 1.2640468935776656],
  [1599782400000, 1.3046660276041746],
  [1599868800000, 1.2353071112402347],
  [1599955200000, 1.2890192550317707],
  [1600041600000, 1.2820676745011192],
  [1600128000000, 1.3266610578605489],
  [1600214400000, 1.32145483812838],
  [1600300800000, 1.610135715871323],
  [1600387200000, 1.7100589583119608],
  [1600473600000, 1.7013663347299892],
  [1600560000000, 1.7141933892921697],
  [1600646400000, 1.7206266709597255],
  [1600732800000, 1.7295736015413643],
  [1600819200000, 1.6728243959315632],
  [1600905600000, 1.8018099807593875],
  [1600992000000, 2.277297281035082],
  [1601078400000, 1.8797683559193057],
  [1601164800000, 1.7818873982430743],
  [1601251200000, 1.5331580254578372],
  [1601337600000, 1.6476344110525445],
  [1601424000000, 1.6435637975588069],
  [1601510400000, 1.57055831340055],
  [1601596800000, 1.535947914147612],
  [1601683200000, 1.5249521168265767],
  [1601769600000, 1.4591666879892653],
  [1601856000000, 1.3696303141734143],
  [1601942400000, 1.2401887078227227],
  [1602028800000, 0.9781608588116959],
  [1602115200000, 1.2055670797350913],
  [1602201600000, 1.2913862312925442],
  [1602288000000, 1.2758739244922077],
  [1602374400000, 1.454668138594685],
  [1602460800000, 1.3722554655267385],
  [1602547200000, 1.386560432160544],
  [1602633600000, 1.3420303541112644],
  [1602720000000, 1.3550921719572997],
  [1602806400000, 1.3275878643162695],
  [1602892800000, 1.166430091602691],
  [1602979200000, 1.1784382292052638],
  [1603065600000, 1.25075771337124],
  [1603152000000, 1.150911218312466],
  [1603238400000, 1.0861307454643432],
  [1603324800000, 1.1078946183461529],
  [1603411200000, 1.130136970317889],
  [1603497600000, 1.0417557657981806],
  [1603584000000, 1.0328876184427205],
  [1603670400000, 1.0360668918399971],
  [1603756800000, 1.0537749753675116],
  [1603843200000, 1.0720587319389203],
  [1603929600000, 0.9954085036589633],
  [1604016000000, 0.8838311122838592],
  [1604102400000, 0.8344803462247],
  [1604188800000, 0.8358166896714859],
  [1604275200000, 0.7968024848893835],
  [1604361600000, 0.7781690990389256],
  [1604448000000, 0.7278729607187047],
  [1604534400000, 0.7677917026127928],
  [1604620800000, 0.8895402793954095],
  [1604707200000, 1.0527038174225423],
  [1604793600000, 1.0160627389679657],
  [1604880000000, 1.1951059744603643],
  [1604966400000, 1.077835088684512],
  [1605052800000, 1.1439912581997314],
  [1605139200000, 1.068202632896159],
  [1605225600000, 1.048987096482382],
  [1605312000000, 1.1406682920339117],
  [1605398400000, 1.152990118281449],
  [1605484800000, 1.1605689281405895],
  [1605571200000, 1.257425393506092],
  [1605657600000, 1.4466886972446527],
  [1605744000000, 1.4660328433884733],
  [1605830400000, 1.6461825805863641],
  [1605916800000, 1.7044854875093063],
  [1606003200000, 1.812227610337571],
  [1606089600000, 1.6505088703882282],
  [1606176000000, 1.7740326726627467],
  [1606262400000, 1.629413411877966],
  [1606348800000, 1.5076035698152659],
  [1606435200000, 1.3786755562951667],
  [1606521600000, 1.322535502341411],
  [1606608000000, 1.3663710846281072],
  [1606694400000, 1.4000506323839688],
  [1606780800000, 1.414686946094345],
  [1606867200000, 1.3678235979010094],
  [1606882103000, 1.35365084026006],
]

export default Index
