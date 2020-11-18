import React, { useState } from 'react'
import { Row, Typography, Checkbox, Tooltip } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import algoliasearch from 'algoliasearch'
import Fade from 'react-reveal/Fade'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AppLayout, { Content } from '../../components/AppLayout'
import AccountIcon from '../../components/AccountIcon'
import ActivityList from '../../components/ActivityList'
import WitnessesList from '../../components/WitnessesList'
import HotspotImg from '../../public/images/hotspot.svg'
import NearbyHotspotsList from '../../components/NearbyHotspotsList'
import { formatHotspotName } from '../../components/Hotspots/utils'

const HotspotMapbox = dynamic(() => import('../../components/HotspotMapbox'), {
  ssr: false,
  loading: () => <div style={{ height: 400, width: '100%' }} />,
})

const { Title, Text } = Typography

function HotspotView({ hotspot, witnesses, nearbyHotspots }) {
  const [showWitnesses, setShowWitnesses] = useState(false)

  return (
    <AppLayout>
      <Content
        style={{ marginTop: 0, background: '#27284B', padding: '0px 0 0px' }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container-hotspot-view"
        >
          <HotspotMapbox
            hotspot={hotspot}
            witnesses={witnesses}
            showWitnesses={showWitnesses}
          />
          <div style={{ textAlign: 'right', paddingTop: 6, color: 'white' }}>
            <Checkbox
              onChange={(e) => setShowWitnesses(e.target.checked)}
              checked={showWitnesses}
              style={{ color: 'white' }}
            >
              Show witnesses
            </Checkbox>
            <p style={{ marginBottom: '-20px' }}>
              {hotspot?.geocode?.longCity === undefined &&
              hotspot?.geocode?.shortState === undefined &&
              hotspot?.geocode?.longCountry === undefined
                ? // Still loading the location data
                  `Loading location data...`
                : hotspot?.geocode?.longCity === null &&
                  hotspot?.geocode?.shortState === null &&
                  hotspot?.geocode?.longCountry === null
                ? // The hotspot doesn't have a location
                  `No location data`
                : // The hotspot has location data
                  `${hotspot?.geocode?.longCity}, ${
                    hotspot?.geocode?.shortState !== null &&
                    hotspot?.geocode?.shortState !== undefined
                      ? // Add the state if it's included in the data
                        `${hotspot?.geocode?.shortState}, `
                      : ``
                  }${hotspot?.geocode?.longCountry}`}
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
                <Fade delay={1000}>
                  <Tooltip
                    placement="bottom"
                    title="The network score of this hotspot. From 0 to 1, with 1 being optimum performance."
                  >
                    <h3
                      style={{
                        color: '#27284B',
                        background: '#BE73FF',
                        padding: '1px 6px',
                        borderRadius: 6,
                        fontSize: 16,
                        fontWeight: 600,
                        display: 'inline-block',
                        letterSpacing: -0.5,
                      }}
                    >
                      {round(hotspot.score, 2)}
                    </h3>
                  </Tooltip>
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
        </div>

        <div className="bottombar">
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
        <WitnessesList witnesses={witnesses} />
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 20,
          marginTop: 0,
        }}
      >
        <NearbyHotspotsList nearbyHotspots={nearbyHotspots} />
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

  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
  )
  const hotspotsIndex = algoliaClient.initIndex('hotspots')
  const { hits: nearbyHotspots } = await hotspotsIndex.search('', {
    aroundLatLng: [hotspot.lat, hotspot.lng].join(', '),
    getRankingInfo: true,
    filters: `NOT address:${hotspotid}`,
  })

  // TODO convert to use @helium/http
  const witnesses = await fetch(
    `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
  )
    .then((res) => res.json())
    .then((json) => json.data.filter((w) => !(w.address === hotspotid)))

  return {
    props: {
      hotspot: JSON.parse(JSON.stringify(hotspot)),
      nearbyHotspots,
      witnesses,
    },
    revalidate: 10,
  }
}

export default HotspotView
