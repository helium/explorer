import { useState, useEffect } from 'react'
import { Row, Typography, Checkbox, Tooltip, Tabs } from 'antd'
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
import ReactCountryFlag from 'react-country-flag'

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
    loading: () => <div className="h-80 md:h-96" />,
  },
)

const { Title, Text } = Typography
const { TabPane } = Tabs

const HotspotView = ({ hotspot }) => {
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
      <div className="bg-navy-500 mt-0 p-0">
        <div className="px-0 sm:px-5 my-0 mx-auto max-w-4xl">
          <HotspotMapbox
            classes={'h-80 md:h-96'}
            hotspot={hotspot}
            witnesses={witnesses}
            nearbyHotspots={nearbyHotspots}
          />
          {hotspot.lng !== undefined && hotspot.lat !== undefined && (
            <div className="flex justify-between pt-3 w-full pb-8">
              <p
                className="px-5 sm:px-0 text-white"
                style={{ fontWeight: 600 }}
              >
                {hotspot.geocode.shortCountry && (
                  <ReactCountryFlag
                    countryCode={hotspot.geocode.shortCountry}
                    className="mr-2"
                  />
                )}
                {formatLocation(hotspot?.geocode)}
              </p>
            </div>
          )}

          <Row className="px-5 sm:px-0 pb-4 sm:pb-8">
            <div className="flex justify-start items-start pr-5">
              <div className="w-full">
                <Fade delay={500}>
                  <div className="flex flex-row items-center justify-start p-0 pb-2 w-auto">
                    <div className="flex flex-row items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full">
                      <Tooltip
                        placement="top"
                        title={`Hotspot is ${hotspot.status.online}`}
                      >
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            hotspot.status.online
                              ? 'bg-green-500'
                              : 'bg-red-400'
                          }`}
                        />
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
                        <p className="text-gray-300 ml-2 mb-0">
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
                      <div className="flex flex-row ml-2.5 items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full">
                        <Tooltip
                          placement="top"
                          title={`Reward scale: ${hotspot.rewardScale}`}
                        >
                          <span className="flex items-center justify-center">
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
                          <p className="mb-0 text-gray-300 ml-2">
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
                <div className="hotspot-name">
                  <Title
                    style={{
                      color: 'white',
                      marginTop: 10,
                      letterSpacing: '-2px',
                    }}
                  >
                    {formatHotspotName(hotspot.name)}
                  </Title>
                </div>
                <Tooltip
                  placement="bottom"
                  title="Hotspot Network Address"
                  className="hidden-xs"
                >
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
        <div className="hidden md:block max-w-4xl mt-10 pb-12 mx-auto ">
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
        <div className="w-full bg-navy-600 px-5 md:px-8 py-5 text-center">
          <Content style={{ maxWidth: 850, margin: '0 auto' }}>
            <div className="flex flex-row justify-between items-center m-0 w-full">
              <p className="text-white m-0">Owned by:</p>
              <div className="flex flex-row justify-center items-center">
                <span className="ml-0 sm:ml-3 mr-1 mt-1">
                  <AccountIcon address={hotspot.owner} size={18} />
                </span>
                <Link href={'/accounts/' + hotspot.owner}>
                  <a className="break-all hidden sm:block">{hotspot.owner}</a>
                </Link>
                <Link href={'/accounts/' + hotspot.owner}>
                  <a className="break-all block sm:hidden">
                    {hotspot.owner.substr(0, 10)}...
                    {hotspot.owner.substr(-10)}
                  </a>
                </Link>
              </div>
            </div>
          </Content>
        </div>
      </div>

      <Content
        style={{
          maxWidth: 850,
        }}
        classes="mx-auto pb-5 mt-0"
      >
        <RewardSummary rewardsLoading={rewardsLoading} rewards={rewards} />
      </Content>
      <div className="hidden sm:block">
        <Content
          style={{
            maxWidth: 850,
          }}
          classes="mx-auto pb-5 mt-0"
        >
          <WitnessesList
            witnessesLoading={witnessesLoading}
            witnesses={witnesses}
          />
        </Content>

        <Content
          style={{
            maxWidth: 850,
          }}
          classes="mx-auto pb-5 mt-0"
        >
          <NearbyHotspotsList
            nearbyHotspotsLoading={nearbyHotspotsLoading}
            nearbyHotspots={nearbyHotspots}
          />
        </Content>
        <Content
          style={{
            maxWidth: 850,
          }}
          classes="mx-auto pb-5 mt-0"
        >
          <ActivityList type="hotspot" address={hotspot.address} />
        </Content>
      </div>

      <Content
        style={{
          maxWidth: 850,
        }}
        classes="mx-auto mt-5 pb-24 block sm:hidden"
      >
        <Tabs
          className=""
          centered
          style={{
            background: 'white',
          }}
        >
          <TabPane tab="Activity" key="1" style={{ paddingBottom: 50 }}>
            <ActivityList type="hotspot" address={hotspot.address} />
          </TabPane>
          <TabPane tab="Witnesses" key="2" style={{ paddingBottom: 50 }}>
            <WitnessesList
              witnessesLoading={witnessesLoading}
              witnesses={witnesses}
            />
          </TabPane>
          <TabPane tab="Nearby Hotspots" key="3" style={{ paddingBottom: 50 }}>
            <NearbyHotspotsList
              nearbyHotspotsLoading={nearbyHotspotsLoading}
              nearbyHotspots={nearbyHotspots}
            />
          </TabPane>
        </Tabs>
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
