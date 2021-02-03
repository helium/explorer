import React from 'react'
import { Card, Row, Col } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { fetchMarket, useMarket } from '../data/market'
import { fetchStats, useStats } from '../data/stats'
import { fetchOraclePrices, useOraclePrices } from '../data/oracles'
import { fetchElections, useElections } from '../data/consensus'
import { formatLocation } from '../components/Hotspots/utils'

import TopChart from '../components/AppLayout/TopChart'
import { withRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import TopBanner from '../components/AppLayout/TopBanner'
import Widget from '../components/Home/Widget'
import TokenImg from '../public/images/token.svg'
import animalHash from 'angry-purple-tiger'

const ConsensusMapbox = dynamic(
  () => import('../components/Txns/ConsensusMapbox'),
  {
    ssr: false,
    loading: () => <span style={{ height: '600px' }} />,
  },
)

function Market({ stats: initialStats, consensusGroups: initialElections }) {
  const { stats } = useStats(initialStats)
  const { consensusGroups } = useElections(initialElections)

  return (
    <AppLayout
      title={'Consensus Groups'}
      description={
        'The hotspots that have been elected to be part of a consensus group'
      }
      // openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/market.png`}
      url={`https://explorer.helium.com/consensus`}
    >
      <TopBanner icon={TokenImg} title="Consensus Groups" />
      {consensusGroups.currentElection && (
        <ConsensusMapbox members={consensusGroups.currentElection} />
      )}
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          padding: '40px 10px 100px',
        }}
      >
        <Card title={`Currently Elected Hotspots`} style={{ marginBottom: 24 }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', padding: 24 }}
          >
            <p style={{ fontSize: 18, fontWeight: 600 }}>
              Block {consensusGroups.recentElections[0].height}
            </p>
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
                  <p
                    style={{
                      color: '#555',
                      paddingLeft: 'calc(36px + 10px)',
                    }}
                  >
                    {formatLocation(m.geocode)}
                  </p>
                </li>
              )
            })}
          </div>
        </Card>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={6}>
            <Widget
              title="Placeholder"
              value={0}
              // change={market.priceChange}
              // changeSuffix="%"
              // changePrecision={1}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Placeholder"
              value={0}
              // change={market.priceChange}
              // changeSuffix="%"
              // changePrecision={1}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Placeholder"
              value={0}
              // change={market.priceChange}
              // changeSuffix="%"
              // changePrecision={1}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
          <Col xs={24} md={6}>
            <Widget
              title="Placeholder"
              value={0}
              // change={market.priceChange}
              // changeSuffix="%"
              // changePrecision={1}
              tooltip="Based on data provided by CoinGecko"
              footer="View more"
              href="https://www.coingecko.com/en/coins/helium"
            />
          </Col>
        </Row>
        <Card title="Recent Consensus Groups">
          {consensusGroups.recentElections?.map((e, i) => {
            if (i !== 0) {
              return (
                <div
                  style={{
                    padding: 24,
                  }}
                >
                  <p>{e.height}</p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {e.members.map((m, memberIndex) => {
                      return (
                        <>
                          <Link href={`/hotspots/${m}`}>
                            <a>{animalHash(m)}</a>
                          </Link>
                        </>
                      )
                    })}
                  </div>
                </div>
              )
            }
          })}
        </Card>
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const [market, stats, oraclePrices, consensusGroups] = await Promise.all([
    fetchMarket(),
    fetchStats(),
    fetchOraclePrices(),
    fetchElections(),
  ])

  return {
    props: {
      market,
      stats,
      oraclePrices,
      consensusGroups: JSON.parse(JSON.stringify(consensusGroups)),
    },
    revalidate: 10,
  }
}

export default withRouter(Market)
