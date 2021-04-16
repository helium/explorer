import { useState, useEffect } from 'react'
import { Row, Typography, Tooltip, Tabs } from 'antd'
import { Client } from '@helium/http'
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
  isRelay,
} from '../../components/Hotspots/utils'
import ReactCountryFlag from 'react-country-flag'
import { fetchNearbyHotspots } from '../../data/hotspots'
import RewardScalePill from '../../components/Hotspots/RewardScalePill'
import { getCoverageFromBounds } from '../../commonjs/coverage'
import StatusPill from '../../components/Hotspots/StatusPill'
import RelayPill from '../../components/Hotspots/RelayPill'

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
  const [nearbyHotspots, setNearbyHotspots] = useState([])

  const [witnessesLoading, setWitnessesLoading] = useState(true)
  const [nearbyHotspotsLoading, setNearbyHotspotsLoading] = useState(true)

  const [loading, setLoading] = useState(true)

  const [boundsNELat, setBoundsNELat] = useState(null)
  const [boundsNELon, setBoundsNELon] = useState(null)
  const [boundsSWLat, setBoundsSWLat] = useState(null)
  const [boundsSWLon, setBoundsSWLon] = useState(null)

  const DYNAMIC_LOADING_ZOOM_THRESHOLD = 12

  useEffect(() => {
    const getNewCoverage = async () => {
      setNearbyHotspotsLoading(true)
      const hotspotsInBounds = await getCoverageFromBounds({
        boundsNELat,
        boundsNELon,
        boundsSWLat,
        boundsSWLon,
      })
      console.log(hotspotsInBounds)
      setNearbyHotspots(hotspotsInBounds.data)
      setNearbyHotspotsLoading(false)
    }
    // console.log(boundsNELat)
    // console.log(boundsNELon)
    // console.log(boundsSWLat)
    // console.log(boundsSWLon)
    if (
      boundsNELat !== null &&
      boundsNELon !== null &&
      boundsSWLat !== null &&
      boundsSWLon !== null
    ) {
      getNewCoverage()
    }
  }, [boundsNELat, boundsNELon, boundsSWLat, boundsSWLon])

  const handleDynamicMapLoad = (mapData) => {
    const bounds = mapData.getBounds()
    // const zoom = mapData.getZoom()
    // console.log(bounds)
    setBoundsNELat(bounds._ne.lat)
    setBoundsNELon(bounds._ne.lng)
    setBoundsSWLat(bounds._sw.lat)
    setBoundsSWLon(bounds._sw.lng)
  }

  useEffect(() => {
    setLoading(!(!witnessesLoading && !nearbyHotspotsLoading))
  }, [witnessesLoading, nearbyHotspotsLoading])

  useEffect(() => {
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

    getWitnesses()
    getNearbyHotspots()
  }, [])

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
            handleDynamicMapLoad={handleDynamicMapLoad}
          />
          {hotspot.lng !== undefined && hotspot.lat !== undefined && (
            <div className="flex justify-between pt-3 w-full pb-8">
              <p
                className="px-5 sm:px-0 text-white flex flex-row items-center justify-start"
                style={{ fontWeight: 600 }}
              >
                {hotspot.geocode.shortCountry && (
                  <ReactCountryFlag
                    countryCode={hotspot.geocode.shortCountry}
                    svg
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
                    <StatusPill hotspot={hotspot} />
                    {hotspot.rewardScale && (
                      <RewardScalePill hotspot={hotspot} className="ml-2.5" />
                    )}
                    {isRelay(hotspot.status.listen_addrs) && (
                      <RelayPill className="ml-2.5" />
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
        <div className={`hidden md:block max-w-4xl mx-auto`}>
          <Checklist
            hotspot={hotspot}
            witnesses={witnesses}
            loading={loading}
            witnessesLoading={witnessesLoading}
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
        classes="mx-auto mt-5 pb-10"
      >
        <Tabs
          className=""
          defaultActiveKey="1"
          centered
          tabBarStyle={{ margin: 0, backgroundColor: 'white' }}
        >
          <TabPane tab="Witnesses" key="1" style={{ paddingBottom: 50 }}>
            <WitnessesList
              witnessesLoading={witnessesLoading}
              witnesses={witnesses}
            />
          </TabPane>
          <TabPane tab="Nearby Hotspots" key="2" style={{ paddingBottom: 50 }}>
            <NearbyHotspotsList
              nearbyHotspotsLoading={nearbyHotspotsLoading}
              nearbyHotspots={nearbyHotspots}
            />
          </TabPane>
          <TabPane tab="Rewards" key="3" style={{ paddingBottom: 50 }}>
            <RewardSummary hotspot={hotspot} />
          </TabPane>
          <TabPane tab="Activity" key="4" style={{ paddingBottom: 50 }}>
            <ActivityList type="hotspot" address={hotspot.address} />
          </TabPane>
        </Tabs>
      </Content>
    </AppLayout>
  )
}

export async function getServerSideProps({ params }) {
  const client = new Client()
  const { hotspotid } = params
  let hotspot
  try {
    hotspot = await client.hotspots.get(hotspotid)
  } catch (e) {
    if (e.response.status === 404) {
      // serve the 404 page if it's a 404 error, otherwise it'll throw the appropriate server error
      return { notFound: true }
    }
    throw e
  }

  return {
    props: {
      key: hotspotid,
      hotspot: JSON.parse(JSON.stringify(hotspot)),
    },
  }
}

export default HotspotView
