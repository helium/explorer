import { useState, useEffect } from 'react'
import { Row, Typography, Checkbox, Tooltip } from 'antd'
import Client from '@helium/http'
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
import sumBy from 'lodash/sumBy'

import {
  fetchNearbyHotspots,
  getHotspotRewardsBuckets,
} from '../../data/hotspots'
import Hex from '../../components/Hex'
import { generateRewardScaleColor } from '../../components/Hotspots/utils'

const HotspotMapbox = dynamic(
  () => import('../../components/Hotspots/HotspotMapbox'),
  {
    ssr: false,
    loading: () => <div style={{ height: 400, width: '100%' }} />,
  },
)

const { Title, Text } = Typography

const HotspotView = ({ hotspot }) => {
  const [showWitnesses, setShowWitnesses] = useState(true)
  const [showNearbyHotspots, setShowNearbyHotspots] = useState(true)

  const [witnesses, setWitnesses] = useState([])
  const [activity, setActivity] = useState({})
  const [rewards, setRewards] = useState([])
  const [nearbyHotspots, setNearbyHotspots] = useState([])

  const [witnessesLoading, setWitnessesLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [rewardsLoading, setRewardsLoading] = useState(true)
  const [nearbyHotspotsLoading, setNearbyHotspotsLoading] = useState(true)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(
      !(
        !witnessesLoading &&
        !activityLoading &&
        !rewardsLoading &&
        !nearbyHotspotsLoading
      ),
    )
  }, [witnessesLoading, activityLoading, rewardsLoading, nearbyHotspotsLoading])

  useEffect(() => {
    const client = new Client()
    const hotspotid = hotspot.address

    async function getWitnesses() {
      setWitnessesLoading(true)
      // // TODO convert to use @helium/http
      const witnesses = await fetch(
        `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
      )
        .then((res) => res.json())
        .then((json) => json.data.filter((w) => !(w.address === hotspotid)))
      setWitnesses(witnesses)
      setWitnessesLoading(false)
    }
    async function getNearbyHotspots() {
      setNearbyHotspotsLoading(true)
      const hotspots = await fetchNearbyHotspots(hotspot.lat, hotspot.lng, 2000)
      setNearbyHotspots(hotspots.filter((h) => h.address !== hotspotid))
      setNearbyHotspotsLoading(false)
    }

    async function getHotspotActivity() {
      setActivityLoading(true)
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
      setActivity(hotspotActivity)
      setActivityLoading(false)
    }

    async function getHotspotRewards() {
      setRewardsLoading(true)
      const sixtyDays = await getHotspotRewardsBuckets(hotspotid, 60, 'day')
      const fourtyEightHours = await getHotspotRewardsBuckets(
        hotspotid,
        48,
        'hour',
      )
      const oneYear = await getHotspotRewardsBuckets(hotspotid, 365, 'day')
      setRewards({
        buckets: { days: sixtyDays, hours: fourtyEightHours, year: oneYear },
        day: sumBy(sixtyDays.slice(0, 1), 'total'),
        previousDay: sumBy(sixtyDays.slice(1, 2), 'total'),
        week: sumBy(sixtyDays.slice(0, 7), 'total'),
        previousWeek: sumBy(sixtyDays.slice(7, 14), 'total'),
        month: sumBy(sixtyDays.slice(0, 30), 'total'),
        previousMonth: sumBy(sixtyDays.slice(30, 60), 'total'),
        oneYear: sumBy(oneYear, 'total'),
      })
      setRewardsLoading(false)
    }

    getWitnesses()
    getNearbyHotspots()
    getHotspotActivity()
    getHotspotRewards()
  }, [hotspot.address])

  return (
    <AppLayout
      title={`${animalHash(hotspot.address)} | Hotspot `}
      description={`A Helium Hotspot ${
        hotspot.location
          ? `located in ${formatLocation(hotspot?.geocode)}`
          : `with no location asserted`
      }, belonging to account ${hotspot.owner}`}
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/hotspots.png`}
      url={`https://explorer.helium.com/hotspots/${hotspot.address}`}
    >
      <Content
        style={{
          marginTop: 0,
          background: '#222e46',
          padding: '0px 0 0px',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container-hotspot-view"
        >
          <HotspotMapbox
            hotspot={hotspot}
            witnesses={witnesses}
            showWitnesses={showWitnesses}
            nearbyHotspots={nearbyHotspots}
            showNearbyHotspots={showNearbyHotspots}
          />
          {hotspot.lng !== undefined && hotspot.lat !== undefined && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 10,
                color: 'white',
                width: '100%',
              }}
            >
              <p style={{ marginBottom: '-20px', fontWeight: 600 }}>
                {formatLocation(hotspot?.geocode)}
              </p>
              <div>
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
              </div>
            </div>
          )}

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
                            marginLeft: 8,
                          }}
                        >
                          {hotspot.status.online === 'offline'
                            ? `Offline`
                            : hotspot.block - hotspot.status?.height >= 500 ||
                              hotspot.status.height === null
                            ? `Syncing`
                            : `Synced`}
                        </p>
                      </Tooltip>
                    </div>

                    {hotspot.rewardScale && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginLeft: '10px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px 10px',
                          backgroundColor: '#182035',
                          borderRadius: '20px',
                        }}
                      >
                        <Tooltip
                          placement="top"
                          title={`Reward scale: ${hotspot.rewardScale}`}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Hex
                              width={10.5}
                              height={12}
                              fillColor={generateRewardScaleColor(
                                hotspot.rewardScale,
                              )}
                            />
                          </span>
                        </Tooltip>

                        <Tooltip
                          placement="top"
                          title={`A Hotspot's own reward scale does not impact its earnings. Hotspots witnessing this Hotspot will see their rewards scaled up or down according to this Hotspot's reward scale.`}
                        >
                          <p
                            style={{
                              marginBottom: 0,
                              color: '#8283B2',
                              marginLeft: 8,
                            }}
                          >
                            {hotspot.rewardScale.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </Fade>
                <span className="hotspot-name">
                  <Title
                    style={{
                      color: 'white',
                      fontSize: 52,
                      marginTop: 10,
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
        </div>
        <div
          style={{
            maxWidth: 850 + 40,
            margin: '0 auto',
            paddingBottom: 50,
            marginTop: 40,
          }}
        >
          <Checklist
            hotspot={hotspot}
            witnesses={witnesses}
            activity={activity}
            loading={loading}
            rewardsLoading={rewardsLoading}
            witnessesLoading={witnessesLoading}
            activityLoading={activityLoading}
          />
        </div>
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgb(24, 32, 53)',
            padding: '20px',
            textAlign: 'center',
          }}
        >
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
        <RewardSummary rewardsLoading={rewardsLoading} rewards={rewards} />
      </Content>
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        <WitnessesList
          witnessesLoading={witnessesLoading}
          witnesses={witnesses}
        />
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        <NearbyHotspotsList
          nearbyHotspotsLoading={nearbyHotspotsLoading}
          nearbyHotspots={nearbyHotspots}
        />
      </Content>
      <Content
        style={{
          marginTop: '20px',
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        <ActivityList type="hotspot" address={hotspot.address} />
      </Content>
    </AppLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const client = new Client()
  const { hotspotid } = params
  const hotspot = await client.hotspots.get(hotspotid)

  return {
    props: {
      hotspot: JSON.parse(JSON.stringify(hotspot)),
    },
    revalidate: 10,
  }
}

export default HotspotView
