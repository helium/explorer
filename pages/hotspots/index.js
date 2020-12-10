import React from 'react'
import { Card, Row, Col } from 'antd'
import Client from '@helium/http'
import countBy from 'lodash/countBy'
import AppLayout, { Content } from '../../components/AppLayout'
import HotspotChart from '../../components/Hotspots/HotspotChart'
import LatestHotspotsTable from '../../components/Hotspots/LatestHotspotsTable'
import { fetchStats, useStats } from '../../data/stats'
import { sub, compareAsc, getUnixTime } from 'date-fns'
import { useLatestHotspots } from '../../data/hotspots'
import TopBanner from '../../components/AppLayout/TopBanner'
import TopChart from '../../components/AppLayout/TopChart'
import HotspotsImg from '../../public/images/hotspots.svg'
import Widget from '../../components/Home/Widget'
import dynamic from 'next/dynamic'

const MiniCoverageMap = dynamic(
  () => import('../../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

function Hotspots({
  hotspotGrowth,
  onlineHotspotCount,
  latestHotspots: initialLatestHotspots,
  stats: initialStats,
}) {
  const {
    stats: { totalHotspots, totalCities, totalCountries },
  } = useStats(initialStats)
  const { latestHotspots } = useLatestHotspots(initialLatestHotspots)

  return (
    <AppLayout
      title={'Hotspots'}
      description={
        'An overview of the Hotspots that make up the Helium network'
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/hotspots.png`}
      url={`https://explorer.helium.com/accounts/hotspots`}
    >
      <TopBanner icon={HotspotsImg} title="Hotspots" />

      <TopChart
        title="Hotspot Network Growth"
        chart={<HotspotChart data={hotspotGrowth} />}
      />

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          padding: '20px 10px 100px',
        }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <Widget
              title="Total Hotspots"
              value={totalHotspots.toLocaleString()}
              change={
                ((totalHotspots - hotspotGrowth.slice(-11, -10)[0].count) /
                  totalHotspots) *
                100
              }
              changeSuffix="%"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Hotspots Online"
              value={onlineHotspotCount.toLocaleString()}
              change={(onlineHotspotCount / totalHotspots) * 100}
              changeSuffix="%"
              changeIsAmbivalent
            />
          </Col>
          <Col xs={12} md={6}>
            <Widget title="Cities" value={totalCities.toLocaleString()} />
          </Col>
          <Col xs={12} md={6}>
            <Widget title="Countries" value={totalCountries.toLocaleString()} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div
              style={{
                backgroundColor: '#1d1f40',
                paddingTop: 10,
                borderRadius: 10,
              }}
            >
              <a href="/coverage">
                <MiniCoverageMap zoomLevel={0.9} />
              </a>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Latest Hotspots" bodyStyle={{ padding: '20px 0' }}>
              <LatestHotspotsTable hotspots={latestHotspots} />
            </Card>
          </Col>
        </Row>
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const client = new Client()
  const stats = await fetchStats()
  const hotspots = await (await client.hotspots.list()).take(100000)

  const now = new Date()

  const hotspotGrowth = [
    {
      time: getUnixTime(now),
      count: stats.totalHotspots,
    },
  ]

  Array.from({ length: 39 }, (x, i) => {
    const date = sub(now, { weeks: i + 1 })
    // count hotspots where the time added is earlier than the given date
    const count = countBy(
      hotspots,
      (h) => compareAsc(new Date(h.timestampAdded), date) === -1,
    ).true

    hotspotGrowth.unshift({
      time: getUnixTime(date),
      count,
    })
  })

  const onlineHotspotCount = countBy(
    hotspots,
    (h) => h.status.online === 'online',
  ).true

  const latestHotspots = JSON.parse(JSON.stringify(hotspots.slice(0, 20)))

  return {
    props: {
      hotspotGrowth,
      onlineHotspotCount,
      latestHotspots,
      stats,
    },
    revalidate: 60,
  }
}

export default Hotspots
