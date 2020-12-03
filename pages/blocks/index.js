import React from 'react'
import { Typography, Card, Statistic, Row, Col, Tooltip } from 'antd'
import AppLayout, { Content } from '../../components/AppLayout'
import { fetchStats, useStats } from '../../data/stats'
import BlocksList from '../../components/BlocksList'
import BlocksImg from '../../public/images/blocks.svg'
import TopChart from '../../components/AppLayout/TopChart'
import TopBanner from '../../components/AppLayout/TopBanner'
import BlocksBarChart from '../../components/Blocks/BlocksBarChart'
import { useLatestBlocks, fetchLatestBlocks } from '../../data/blocks'
import Widget from '../../components/Home/Widget'
import round from 'lodash/round'

const { Title } = Typography

function Blocks({ stats: initialStats, latestBlocks: initialLatestBlocks }) {
  const { stats } = useStats(initialStats)
  const { latestBlocks } = useLatestBlocks(initialLatestBlocks)

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          backgroundColor: '#101725',
          padding: '60px 0 20px',
        }}
      >
        <TopBanner>
          <Row align="middle" gutter={[20, 50]}>
            <img src={BlocksImg} style={{ marginRight: 10, width: 50 }} />
            <Title
              style={{
                margin: 0,
                maxWidth: 550,
                letterSpacing: '-2px',
                fontSize: 38,
                lineHeight: 1,
                color: 'white',
              }}
            >
              Blocks
            </Title>
          </Row>
        </TopBanner>
      </Content>
      <TopChart
        title="Block Time"
        subtitle="50 secs"
        chart={<BlocksBarChart data={latestBlocks} />}
      />

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          paddingBottom: 100,
        }}
      >
        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (1h)"
              value={`${round(stats.blockTimes.lastHour.avg, 1)} secs`}
              tooltip={`standard deviation: ${round(
                stats.blockTimes.lastHour.stddev,
                1,
              )} secs`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (24h)"
              value={`${round(stats.blockTimes.lastDay.avg, 1)} secs`}
              tooltip={`standard deviation: ${round(
                stats.blockTimes.lastDay.stddev,
                1,
              )} secs`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (7d)"
              value={`${round(stats.blockTimes.lastWeek.avg, 1)} secs`}
              tooltip={`standard deviation: ${round(
                stats.blockTimes.lastWeek.stddev,
                1,
              )} secs`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (30d)"
              value={`${round(stats.blockTimes.lastMonth.avg, 1)} secs`}
              tooltip={`standard deviation: ${round(
                stats.blockTimes.lastMonth.stddev,
                1,
              )} secs`}
            />
          </Col>
        </Row>
        <div style={{ background: 'white', padding: 15 }}>
          <Title level={4} style={{ padding: 10 }}>
            Latest Blocks
          </Title>
          <BlocksList />
        </div>
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const stats = await fetchStats()
  const latestBlocks = await fetchLatestBlocks()

  return {
    props: {
      latestBlocks,
      stats,
    },
    revalidate: 60,
  }
}

export default Blocks
