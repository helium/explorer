import React from 'react'
import { Card, Row, Col } from 'antd'
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
import meanBy from 'lodash/meanBy'
import useResponsive from '../../components/AppLayout/useResponsive'

function Blocks({ stats: initialStats, latestBlocks: initialLatestBlocks }) {
  const { isMobile } = useResponsive()

  const { stats } = useStats(initialStats)
  const { latestBlocks } = useLatestBlocks(initialLatestBlocks)
  const blocks = isMobile ? latestBlocks.slice(0, 40) : latestBlocks

  const txnRate = meanBy(latestBlocks, 'transactionCount')

  return (
    <AppLayout>
      <TopBanner title="Blocks" icon={BlocksImg} />

      <TopChart
        title="Transaction Rate"
        subtitle={`${txnRate} avg per block`}
        chart={<BlocksBarChart data={blocks} />}
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
              title="Transaction Rate"
              value={`${txnRate}`}
              tooltip="Average number of transactions per block"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Election Time (24h)"
              value={`${round(stats.electionTime / 60, 1)} min`}
              tooltip="The consensus group elects new members roughly every 30 min"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="LongFi data (30d)"
              value={`${((stats.dataCredits * 24) / 10e8).toLocaleString()} GB`}
              tooltip="The amount of data transmitted over the Helium network in the past 30 days"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Height"
              value={latestBlocks[0].height.toLocaleString()}
              tooltip="The current height of the blocks in the blockchain"
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (1h)"
              value={`${round(stats.blockTimes.lastHour.avg, 1)} sec`}
              subtitle={`${round(
                stats.blockTimes.lastHour.stddev,
                1,
              )} sec std dev`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (24h)"
              value={`${round(stats.blockTimes.lastDay.avg, 1)} sec`}
              subtitle={`${round(
                stats.blockTimes.lastDay.stddev,
                1,
              )} sec std dev`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (7d)"
              value={`${round(stats.blockTimes.lastWeek.avg, 1)} sec`}
              subtitle={`${round(
                stats.blockTimes.lastWeek.stddev,
                1,
              )} sec std dev`}
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Block Time (30d)"
              value={`${round(stats.blockTimes.lastMonth.avg, 1)} sec`}
              subtitle={`${round(
                stats.blockTimes.lastMonth.stddev,
                1,
              )} sec std dev`}
            />
          </Col>
        </Row>

        <Card title="Latest Blocks">
          <BlocksList />
        </Card>
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
