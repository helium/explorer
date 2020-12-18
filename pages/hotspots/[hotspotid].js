import React, { useState } from 'react'
import { Row, Typography, Checkbox, Tooltip, Skeleton } from 'antd'
import Client from '@helium/http'
import algoliasearch from 'algoliasearch'
import Fade from 'react-reveal/Fade'
import Checklist from '../../components/Hotspots/Checklist/Checklist'
import RewardSummary from '../../components/Hotspots/RewardSummary'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import AppLayout, { Content } from '../../components/AppLayout'
import AccountIcon from '../../components/AccountIcon'
import ActivityList from '../../components/ActivityList'
import WitnessesList from '../../components/WitnessesList'
import HotspotImg from '../../public/images/hotspot.svg'
import NearbyHotspotsList from '../../components/NearbyHotspotsList'
import animalHash from 'angry-purple-tiger'
import {
  formatHotspotName,
  formatLocation,
} from '../../components/Hotspots/utils'

import { useRouter } from 'next/router'

import { fetchRewardsSummary } from '../../data/hotspots'

const HotspotMapbox = dynamic(
  () => import('../../components/Hotspots/HotspotMapbox'),
  {
    ssr: false,
    loading: () => <div style={{ height: 400, width: '100%' }} />,
  },
)

const { Title, Text } = Typography

function HotspotView({
  hotspot,
  witnesses,
  nearbyHotspots,
  activity,
  rewards,
}) {
  const { isFallback } = useRouter()

  const [showWitnesses, setShowWitnesses] = useState(true)
  const [showNearbyHotspots, setShowNearbyHotspots] = useState(true)

  return (
    <AppLayout
      title={
        !isFallback
          ? `${animalHash(hotspot.address)} | Hotspot `
          : 'Helium Hotspot'
      }
      description={
        !isFallback
          ? `A Helium Hotspot ${
              hotspot.location
                ? `located in ${formatLocation(hotspot?.geocode)} with ${
                    witnesses.length
                  } witness${witnesses.length === 1 ? '' : 'es'}`
                : `with no location asserted`
            }, belonging to account ${hotspot.owner}`
          : `A Helium Hotspot on the Helium blockchain`
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/hotspots.png`}
      url={
        !isFallback && `https://explorer.helium.com/hotspots/${hotspot.address}`
      }
    >
      <Content
        style={{
          marginTop: 0,
          background: 'rgb(16, 23, 37)',
          padding: '0px 0 0px',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container-hotspot-view"
        >
          {!isFallback ? (
            <>
              <HotspotMapbox
                hotspot={hotspot}
                witnesses={witnesses}
                showWitnesses={showWitnesses}
                nearbyHotspots={nearbyHotspots}
                showNearbyHotspots={showNearbyHotspots}
              />
              <div
                style={{
                  textAlign: 'right',
                  paddingTop: 10,
                  color: 'white',
                }}
              >
                <Checkbox
                  onChange={(e) => setShowNearbyHotspots(e.target.checked)}
                  checked={showNearbyHotspots}
                  style={{ color: 'white' }}
                >
                  Show nearby hotspots
                </Checkbox>
                <Checkbox
                  onChange={(e) => setShowWitnesses(e.target.checked)}
                  checked={showWitnesses}
                  style={{ color: 'white' }}
                >
                  Show witnesses
                </Checkbox>
                <p style={{ marginBottom: '-20px' }}>
                  {formatLocation(hotspot?.geocode)}
                </p>
              </div>

              <Row style={{ paddingTop: 30 }}>
                <div
                  className="flexwrapper"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    // marginBottom: 50,
                    paddingRight: 20,
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <Fade delay={500}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          padding: '0 0 8px 0',
                          width: 'auto',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px 10px',
                            backgroundColor: '#182035',
                            borderRadius: '20px',
                          }}
                        >
                          <Tooltip
                            placement="top"
                            title={`Hotspot is ${hotspot.status.online}`}
                          >
                            <div
                              style={{
                                height: 10,
                                minWidth: 10,
                                width: 10,
                                // marginLeft: 15,
                                backgroundColor:
                                  hotspot.status.online === 'online'
                                    ? '#32C48D'
                                    : '#fb6666',
                                borderRadius: 20,
                              }}
                            ></div>
                          </Tooltip>
                          <Tooltip
                            placement="top"
                            title={`${
                              hotspot.status.online === 'online' &&
                              hotspot.status.height === null
                                ? 'Beginning to sync'
                                : hotspot.status.online === 'online' &&
                                  hotspot.status.height !== null
                                ? `Syncing block ${hotspot.status?.height.toLocaleString()}. `
                                : 'Hotspot is not syncing. '
                            }${
                              hotspot.status.online === 'online' &&
                              hotspot.status.height !== null
                                ? `Blocks remaining: ${(
                                    hotspot.block - hotspot.status?.height
                                  ).toLocaleString()}.`
                                : ``
                            }`}
                          >
                            <p
                              style={{
                                marginBottom: 0,
                                color: '#8283B2',
                                marginLeft: 10,
                              }}
                            >
                              {hotspot.status.online === 'offline'
                                ? `Offline`
                                : hotspot.block - hotspot.status?.height >=
                                    500 || hotspot.status.height === null
                                ? `Syncing`
                                : `Synced`}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </Fade>
                    <span className="hotspot-name">
                      <Title
                        style={{
                          color: 'white',
                          fontSize: 52,
                          marginTop: 0,
                          letterSpacing: '-2px',
                          marginBottom: 17,
                        }}
                      >
                        {formatHotspotName(hotspot.name)}
                      </Title>
                    </span>
                    <Tooltip placement="bottom" title="Hotspot Network Address">
                      <img
                        src={HotspotImg}
                        style={{
                          height: 15,
                          marginRight: 5,
                          position: 'relative',
                          top: '-2px',
                        }}
                        alt="Hotspot Network Address"
                      />
                      <Text
                        copyable
                        style={{
                          fontFamily: 'monospace',
                          color: '#8283B2',
                          wordBreak: 'break-all',
                        }}
                      >
                        {hotspot.address}
                      </Text>
                    </Tooltip>
                  </div>
                </div>
              </Row>
            </>
          ) : (
            <div style={{ paddingTop: 50, paddingBottom: 50 }}>
              <Skeleton title active />
            </div>
          )}
        </div>
        <div
          style={{ maxWidth: 850 + 40, margin: '0 auto', paddingBottom: 50 }}
        >
          {!isFallback && (
            <Checklist
              hotspot={hotspot}
              witnesses={witnesses}
              activity={activity}
            />
          )}
        </div>
        <div
          style={{
            width: '100%',
            backgroundColor: '#2A344A',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          {!isFallback && (
            <Content style={{ maxWidth: 850, margin: '0 auto' }}>
              <p
                style={{
                  color: 'white',
                  margin: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                Owned by: <br className="line-break-only-at-small" />
                <span style={{ width: 21, marginLeft: 8, marginRight: 2 }}>
                  <AccountIcon address={hotspot.owner} size={18} />
                </span>
                <Link href={'/accounts/' + hotspot.owner}>
                  <a style={{ wordBreak: 'break-all' }}>{hotspot.owner}</a>
                </Link>
              </p>
            </Content>
          )}
        </div>
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        {!isFallback ? (
          <RewardSummary rewards={rewards} />
        ) : (
          <Skeleton active />
        )}
      </Content>
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        {!isFallback ? (
          <WitnessesList witnesses={witnesses} />
        ) : (
          <Skeleton active />
        )}
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        {!isFallback ? (
          <NearbyHotspotsList nearbyHotspots={nearbyHotspots} />
        ) : (
          <Skeleton active />
        )}
      </Content>
      <Content
        style={{
          marginTop: '20px',
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        {!isFallback ? (
          <ActivityList type="hotspot" address={hotspot.address} />
        ) : (
          <Skeleton active />
        )}
      </Content>
    </AppLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const client = new Client()
  const { hotspotid } = params
  const hotspot = await client.hotspots.get(hotspotid)

  // Get most recent challenger transaction
  const challengerTxnList = await client.hotspot(hotspotid).activity.list({
    filterTypes: ['poc_request_v1'],
  })
  const challengerTxn = await challengerTxnList.take(1)

  // Get most recent challengee transaction
  const challengeeTxnList = await client.hotspot(hotspotid).activity.list({
    filterTypes: ['poc_receipts_v1'],
  })
  const challengeeTxn = await challengeeTxnList.take(1)

  // Get most recent rewards transactions to search for...
  const rewardTxnsList = await client.hotspot(hotspotid).activity.list({
    filterTypes: ['rewards_v1'],
  })
  const rewardTxns = await rewardTxnsList.take(200)

  let witnessTxn = null
  // most recent witness transaction
  rewardTxns.some(function (txn) {
    return txn.rewards.some(function (txnReward) {
      if (txnReward.type === 'poc_witnesses') {
        witnessTxn = txn
        return
      }
    })
  })

  let dataTransferTxn = null
  // most recent data credit transaction
  rewardTxns.some(function (txn) {
    return txn.rewards.some(function (txnReward) {
      if (txnReward.type === 'data_credits') {
        dataTransferTxn = txn
        return
      }
    })
  })

  const hotspotActivity = {
    challengerTxn: challengerTxn.length === 1 ? challengerTxn[0] : null,
    challengeeTxn: challengeeTxn.length === 1 ? challengeeTxn[0] : null,
    witnessTxn: witnessTxn,
    dataTransferTxn: dataTransferTxn,
  }
  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
  )
  const hotspotsIndex = algoliaClient.initIndex('hotspots')
  const { hits: nearbyHotspots } = await hotspotsIndex.search('', {
    aroundLatLng: [
      hotspot.lat ? hotspot.lat : 0,
      hotspot.lng ? hotspot.lng : 0,
    ].join(', '),
    getRankingInfo: true,
    filters: `NOT address:${hotspotid}`,
  })

  const rewards = await fetchRewardsSummary(hotspotid)

  // TODO convert to use @helium/http
  const witnesses = await fetch(
    `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
  )
    .then((res) => res.json())
    .then((json) => json.data.filter((w) => !(w.address === hotspotid)))

  return {
    props: {
      hotspot: JSON.parse(JSON.stringify(hotspot)),
      activity: JSON.parse(JSON.stringify(hotspotActivity)),
      nearbyHotspots,
      witnesses,
      rewards,
    },
    revalidate: 10,
  }
}

export default HotspotView
