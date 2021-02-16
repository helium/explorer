import React from 'react'
import { Card, Row, Col, Tooltip, Typography } from 'antd'
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
      <div style={{ display: 'flex', paddingTop: 5 }}>
        {uniqueFlagShortcodes.map((flagId, flagIndex) => {
          return (
            <Tooltip title={flagId.fullCountryName} placement={'bottom'}>
              <ReactCountryFlag
                countryCode={flagId.id}
                style={{
                  fontSize: '1.5em',
                  marginLeft: '6px',
                  lineHeight: '1.5em',
                }}
              />
            </Tooltip>
          )
        })}
      </div>
    )
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
              Currently Elected Hotspots
              <FlagSection group={consensusGroups.currentElection} />
            </>
          }
          style={{ marginBottom: 24 }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', padding: 24 }}
          >
            <Link href={`/blocks/${consensusGroups.recentElections[0].height}`}>
              <a style={{ fontSize: 18, fontWeight: 600, paddingBottom: 12 }}>
                Block{' '}
                {consensusGroups.recentElections[0].height.toLocaleString()}
              </a>
            </Link>
            <Link href={`/txns/${consensusGroups.recentElections[0].hash}`}>
              <a style={{ fontSize: 14, fontWeight: 400, paddingBottom: 36 }}>
                {consensusGroups.recentElections[0].hash}
              </a>
            </Link>
            <ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
              {consensusGroups.currentElection.map((m, mIndex) => {
                return (
                  <li
                    style={{
                      paddingBottom: '18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#ff6666',
                          color: 'white',
                          minHeight: '36px',
                          height: '36px',
                          minWidth: '36px',
                          width: '36px',
                          borderRadius: '36px',
                          textAlign: 'center',
                          boxShadow: '0 0 5px #cccccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          marginBottom: '0px',
                        }}
                      >
                        {mIndex + 1}
                      </span>
                      <Link href={`/hotspots/${m.address}`}>
                        <a style={{ paddingLeft: '10px', fontSize: '18px' }}>
                          {animalHash(m.address)}
                        </a>
                      </Link>
                    </div>
                    <Text
                      type="secondary"
                      copyable
                      style={{ paddingLeft: 'calc(36px + 10px)' }}
                    >
                      {m.address}
                    </Text>
                    <p
                      style={{
                        color: '#555',
                        paddingLeft: 'calc(36px + 10px)',
                      }}
                    >
                      <ReactCountryFlag
                        countryCode={m.geocode.short_country}
                        style={{
                          fontSize: '1.5em',
                          marginRight: '6px',
                          lineHeight: '1.5em',
                        }}
                      />
                      {formatLocation(m.geocode)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
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
          <ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
            {consensusGroups.recentElections?.map((e, i, { length }) => {
              if (i !== 0) {
                return (
                  <>
                    <div
                      style={{
                        padding: 24,
                      }}
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
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {e.members.map((m, memberIndex) => {
                          return (
                            <li
                              style={{
                                paddingBottom: '18px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  justifyContent: 'flex-start',
                                }}
                              >
                                <span
                                  style={{
                                    backgroundColor: '#ff6666',
                                    color: 'white',
                                    minHeight: '24px',
                                    height: '24px',
                                    minWidth: '24px',
                                    width: '24px',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    boxShadow: '0 0 5px #cccccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    marginBottom: '0px',
                                  }}
                                >
                                  {memberIndex + 1}
                                </span>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <Link href={`/hotspots/${m}`}>
                                    <a style={{ paddingLeft: 8 }}>
                                      {animalHash(m)}
                                    </a>
                                  </Link>
                                  <Text
                                    style={{ paddingLeft: 8 }}
                                    type="secondary"
                                    copyable
                                  >
                                    {m}
                                  </Text>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </div>
                    </div>
                    {i !== length - 1 && (
                      <div
                        style={{
                          height: 1,
                          backgroundColor: '#ddd',
                          width: '100%',
                        }}
                      />
                    )}
                  </>
                )
              }
            })}
          </ul>
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
