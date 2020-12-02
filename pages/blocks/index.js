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

const { Title } = Typography

function Blocks({ stats: initialStats, latestBlocks: initialLatestBlocks }) {
  const {
    stats: { totalHotspots, totalCities, totalCountries },
  } = useStats(initialStats)
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
        <div style={{ background: 'white', padding: 15 }}>
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
