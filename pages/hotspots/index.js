import React from 'react'
import { Typography, Card, Statistic, Row, Col, Tooltip } from 'antd'
import Client from '@helium/http'
import countBy from 'lodash/countBy'
import { ArrowUpOutlined } from '@ant-design/icons'
import AppLayout, { Content } from '../../components/AppLayout'
import HotspotChart from '../../components/Hotspots/HotspotChart'
import LatestHotspotsTable from '../../components/Hotspots/LatestHotspotsTable'
import { fetchStats, useStats } from '../../data/stats'

const { Title } = Typography

function Hotspots({
  hotspotGrowth,
  onlineHotspotCount,
  citiesCount,
  countriesCount,
  latestHotspots,
  stats: initialStats,
}) {
  const { stats } = useStats(initialStats)
  const { totalHotspots } = stats

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          background: '#27284B',
          padding: '60px 0 20px',
        }}
      >
        <div style={{ margin: '0 auto', maxWidth: 1190, padding: '0 20px' }}>
          <div className="flexwrapper">
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
              Hotspots
            </Title>
          </div>
        </div>
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          paddingBottom: 100,
        }}
      >
        <div style={{ background: 'white', padding: 15 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={7}>
              <Card
                title="Hotspots"
                bodyStyle={{ padding: 20 }}
                style={{ height: '100%' }}
                extra={
                  <Tooltip title="past week (10,000 blocks)">
                    <Statistic
                      value={
                        ((totalHotspots -
                          hotspotGrowth.slice(-11, -10)[0].count) /
                          totalHotspots) *
                        100
                      }
                      precision={0}
                      valueStyle={{ color: '#3f8600', fontSize: 14 }}
                      prefix={<ArrowUpOutlined />}
                      suffix={<span style={{ fontSize: 12 }}>%</span>}
                    />
                  </Tooltip>
                }
              >
                <Statistic
                  value={totalHotspots}
                  valueStyle={{ fontSize: 40 }}
                />
              </Card>
            </Col>
            <Col xs={24} md={7}>
              <Card
                title="Hotspots Online"
                bodyStyle={{ padding: 20 }}
                style={{ height: '100%' }}
                extra={
                  <Statistic
                    value={(onlineHotspotCount / totalHotspots) * 100}
                    precision={0}
                    valueStyle={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}
                    suffix={<span style={{ fontSize: 12 }}>%</span>}
                  />
                }
              >
                <Statistic
                  value={onlineHotspotCount}
                  valueStyle={{ fontSize: 40 }}
                />
              </Card>
            </Col>
            <Col xs={24} md={10}>
              <Card
                title="Geography"
                bodyStyle={{ padding: 20 }}
                style={{ height: '100%' }}
                extra={<a>more</a>}
              >
                <Row justify="space-around">
                  <Statistic
                    title="Cities"
                    value={citiesCount}
                    valueStyle={{ fontSize: 30 }}
                  />
                  <Statistic
                    title="Countries"
                    value={countriesCount}
                    valueStyle={{ fontSize: 30 }}
                  />
                  <Statistic
                    title="Regions"
                    value={2}
                    valueStyle={{ fontSize: 30 }}
                  />
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                title="Hotspot Network Growth"
                bodyStyle={{ padding: '20px 0' }}
              >
                <HotspotChart data={hotspotGrowth} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Latest Hotspots" bodyStyle={{ padding: '20px 0' }}>
                <LatestHotspotsTable hotspots={latestHotspots} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const client = new Client()
  const stats = await fetchStats()
  const hotspots = await (await client.hotspots.list()).take(100000)
  const cities = await (await client.cities.list()).take(100000)

  const hotspotGrowth = [
    { block: stats.totalBlocks, count: stats.totalHotspots },
  ]

  Array.from({ length: 39 }, (x, i) => {
    const block = stats.totalBlocks - 10000 * (i + 1)
    const count = countBy(hotspots, (h) => h.blockAdded <= block).true
    hotspotGrowth.unshift({ block, count })
  })

  const countriesCount = Object.keys(countBy(cities, 'shortCountry')).length

  const onlineHotspotCount = countBy(
    hotspots,
    (h) => h.status.online === 'online',
  ).true

  const latestHotspots = JSON.parse(
    JSON.stringify(hotspots.slice(0, 20).filter((h) => !!h.location)),
  )

  return {
    props: {
      hotspotGrowth,
      onlineHotspotCount,
      citiesCount: cities.length,
      countriesCount,
      latestHotspots,
      stats,
    },
    revalidate: 60,
  }
}

export default Hotspots
