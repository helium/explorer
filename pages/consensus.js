import React from 'react'
import { Card, Row, Col, Tooltip, Typography, Table, Collapse } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { fetchStats, useStats } from '../data/stats'
import { fetchOraclePrices, useOraclePrices } from '../data/oracles'
import { fetchElections, useElections } from '../data/consensus'
import { formatLocation } from '../components/Hotspots/utils'
import withBlockHeight from '../components/withBlockHeight'
import { formatDistanceToNow, formatDuration, format } from 'date-fns'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import TopBanner from '../components/AppLayout/TopBanner'
import Widget from '../components/Home/Widget'
import ConsensusImg from '../public/images/consensus.svg'
import animalHash from 'angry-purple-tiger'
import round from 'lodash/round'
import ReactCountryFlag from 'react-country-flag'

const { Text } = Typography
const { Panel } = Collapse

const ConsensusMapbox = dynamic(
  () => import('../components/Txns/ConsensusMapbox'),
  {
    ssr: false,
    loading: () => (
      <span style={{ minHeight: 600, backgroundColor: '#324b61' }} />
    ),
  },
)

const Consensus = ({
  stats: initialStats,
  consensusGroups: initialElections,
  height,
  heightLoading,
}) => {
  const { stats } = useStats(initialStats)
  const { consensusGroups } = useElections(initialElections)

  const FlagSection = ({ group }) => {
    const uniqueFlagShortcodes = []
    group?.map((member) => {
      if (
        !uniqueFlagShortcodes.filter(
          (f) => f.id === member.geocode.short_country,
        ).length > 0
      )
        uniqueFlagShortcodes.push({
          id: member.geocode.short_country,
          fullCountryName: member.geocode.long_country,
          count: 1,
        })
    })
    return (
      <div style={{ display: 'flex' }}>
        {uniqueFlagShortcodes.map((flagId, flagIndex) => {
          return (
            <Tooltip title={flagId.fullCountryName} placement={'top'}>
              <ReactCountryFlag
                countryCode={flagId.id}
                style={{
                  fontSize: '2em',
                  marginLeft: flagIndex === 0 ? '0' : '6px',
                  lineHeight: '2em',
                }}
              />
            </Tooltip>
          )
        })}
      </div>
    )
  }
  const transformArray = (incomingArray) => {
    return incomingArray.map((item, index) => ({ index, address: item }))
  }

  const generateColumns = (columnType) => {
    const columns = [
      {
        title: 'Number',
        dataIndex: 'index',
        key: 'index',
        render: (name, row, index) => index + 1,
      },
      {
        title: 'Hotspot Name',
        dataIndex: 'address',
        key: 'address',
        render: (address) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/hotspots/${address}`}>
              <a style={{}}>{animalHash(address)}</a>
            </Link>
            {columnType === 'recent' && (
              <Text type="secondary" copyable>
                {address}
              </Text>
            )}
          </div>
        ),
      },
    ]

    const locationColumn = {
      title: 'Location',
      dataIndex: 'geocode',
      key: 'geocode',
      render: (geocode) => (
        <p
          style={{
            color: '#555',
          }}
        >
          <ReactCountryFlag
            countryCode={geocode.short_country}
            style={{
              fontSize: '1.5em',
              marginRight: '6px',
              lineHeight: '1.5em',
            }}
          />
          {formatLocation(geocode)}
        </p>
      ),
    }
    if (columnType === 'current') columns.push(locationColumn)

    return columns
  }

  return (
    <AppLayout
      title={'Consensus'}
      description={
        'The current and most recent hotspots that have been elected to be part of a consensus group'
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/consensus.png`}
      url={`https://explorer.helium.com/consensus`}
    >
      <TopBanner icon={ConsensusImg} title="Consensus" />
      <div
        style={{ minHeight: 600, width: '100%', backgroundColor: '#324b61' }}
      >
        {consensusGroups.currentElection && (
          <ConsensusMapbox members={consensusGroups.currentElection} />
        )}
      </div>
      <div
        style={{
          width: '100%',
          padding: '0px 0',
          backgroundColor: 'rgb(24, 32, 53)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FlagSection group={consensusGroups.currentElection} />
      </div>
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 890,
          padding: '40px 20px 100px',
        }}
      >
        <Card
          title={
            <>
              <h1 style={{ fontSize: 24, padding: '12px 0 0 0', margin: 0 }}>
                Current Consensus Group
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  href={`/blocks/${consensusGroups.recentElections[0].height}`}
                >
                  <a style={{ paddingBottom: 12 }}>
                    Block{' '}
                    {consensusGroups.recentElections[0].height.toLocaleString()}
                  </a>
                </Link>
                <Link href={`/txns/${consensusGroups.recentElections[0].hash}`}>
                  <a style={{ paddingBottom: 12, fontSize: 12, color: '#bbb' }}>
                    {consensusGroups.recentElections[0].hash}
                  </a>
                </Link>
              </div>
            </>
          }
          style={{ marginBottom: 24 }}
        >
          <Table
            dataSource={consensusGroups.currentElection}
            columns={generateColumns('current')}
            pagination={{
              pageSize: 16,
              showSizeChanger: false,
              hideOnSinglePage: true,
            }}
            scroll={{ x: true }}
          />
        </Card>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Election Times (1h)"
              value={`${round(
                stats.electionTimes.lastHour.avg / 60,
                1,
              ).toLocaleString()} min`}
              subtitle={`${round(
                stats.electionTimes.lastHour.stddev / 60,
                1,
              ).toLocaleString()} min std dev`}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Election Times (24h)"
              value={`${round(
                stats.electionTimes.lastDay.avg / 60,
                1,
              ).toLocaleString()} min`}
              subtitle={`${round(
                stats.electionTimes.lastDay.stddev / 60,
                1,
              ).toLocaleString()} min std dev`}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Election Times (7d)"
              value={`${round(
                stats.electionTimes.lastWeek.avg / 60,
                1,
              ).toLocaleString()} min`}
              subtitle={`${round(
                stats.electionTimes.lastWeek.stddev / 60,
                1,
              ).toLocaleString()} min std dev`}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Election Times (30d)"
              value={`${round(
                stats.electionTimes.lastMonth.avg / 60,
                1,
              ).toLocaleString()} min`}
              subtitle={`${round(
                stats.electionTimes.lastMonth.stddev / 60,
                1,
              ).toLocaleString()} min std dev`}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Time since last election"
              value={formatDistanceToNow(
                new Date(consensusGroups.recentElections[0].time * 1000),
              )}
              subtitle={`Last election: ${format(
                new Date(consensusGroups.recentElections[0].time * 1000),
                'h:mm aaaa, MMM d',
              )}`}
              tooltip="Time elapsed since the most recent consensus election transaction"
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Widget
              title="Blocks since last election"
              value={
                !heightLoading
                  ? `${height - consensusGroups.recentElections[0].height}`
                  : 'Loading...'
              }
              subtitle={`Current height: ${
                !heightLoading ? `${height.toLocaleString()}` : `Loading...`
              }`}
              tooltip="The current block height minus the block height of the most recent consensus election transaction"
            />
          </Col>
        </Row>
        <Card title="Recent Consensus Groups">
          <Collapse>
            {consensusGroups.recentElections?.map((e, i, { length }) => {
              if (i !== 0) {
                return (
                  <Panel
                    key={`${i}-${e.hash}`}
                    header={`Block ${e.height.toLocaleString()}`}
                  >
                    <Link href={`/blocks/${e.height}`}>
                      <a
                        style={{
                          paddingBottom: 12,
                          fontSize: 16,
                          display: 'block',
                        }}
                      >
                        Block {e.height.toLocaleString()}
                      </a>
                    </Link>
                    <Link href={`/txns/${e.hash}`}>
                      <a
                        style={{
                          paddingBottom: 20,
                          fontSize: 12,
                          display: 'block',
                        }}
                      >
                        {e.hash}
                      </a>
                    </Link>
                    <Table
                      dataSource={transformArray(e.members)}
                      columns={generateColumns('recent')}
                      pagination={{
                        pageSize: 16,
                        showSizeChanger: false,
                        hideOnSinglePage: true,
                      }}
                      scroll={{ x: true }}
                    />
                  </Panel>
                )
              }
            })}
          </Collapse>
        </Card>
      </Content>
    </AppLayout>
  )
}

export async function getServerSideProps() {
  const [stats, oraclePrices, consensusGroups] = await Promise.all([
    fetchStats(),
    fetchOraclePrices(),
    fetchElections(),
  ])

  return {
    props: {
      stats,
      oraclePrices,
      consensusGroups: JSON.parse(JSON.stringify(consensusGroups)),
    },
  }
}

export default withBlockHeight(Consensus)
