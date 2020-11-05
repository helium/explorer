import React from 'react'
import { Row, Typography, Checkbox, Tooltip, Card, Table } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout, { Content } from '../../components/AppLayout'
import ActivityList from '../../components/ActivityList'
import Fade from 'react-reveal/Fade'
import HotspotImg from '../../public/images/hotspot.svg'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const HotspotMapbox = dynamic(() => import('../../components/HotspotMapbox'), {
  ssr: false,
  loading: () => <div style={{ height: 400, width: '100%' }} />,
})

const { Title, Text } = Typography

function HotspotView({ hotspot, witnesses }) {
  console.log(witnesses)
  const [showWitnesses, setShowWitnesses] = React.useState(false)

  const witnessColumns = [
    {
      title: 'Hotspot',
      dataIndex: 'name',
      key: 'name',
      render: (data, row) => (
        <Link href={'/hotspots/' + row.address}>
          <a style={{ fontFamily: 'soleil, sans-serif' }}>{data}</a>
        </Link>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'geocode',
      key: 'location',
      render: (data) => (
        <span>
          {data.long_city}, {data.short_state}
        </span>
      ),
    },
    {
      title: 'RSSI',
      dataIndex: 'witness_info',
      key: 'rssi',
      render: (data) => (
        <span>
          {Object.keys(data.histogram).reduce((a, b) =>
            data.histogram[a] > data.histogram[b] ? a : b,
          )}{' '}
          dBm
        </span>
      ),
    },
  ]

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
              {get(hotspot, 'geocode.longCity')},{' '}
              {get(hotspot, 'geocode.shortState')}
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
                    {hotspot.name}
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
            <p style={{ color: 'white', margin: 0 }}>
              Owned by: <br className="line-break-only-at-small" />
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
        <Card title={'Witnesses'}>
          <Table
            dataSource={witnesses.data}
            columns={witnessColumns}
            size="small"
            rowKey="name"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            scroll={{ x: true }}
          />
        </Card>
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
      // TODO convert to use @helium/http
      witnesses: await fetch(
        `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
      )
        .then((res) => res.json())
        .then((json) => json.data.filter((w) => !(w.address === hotspotid))),
    },
    revalidate: 10,
  }
}

export default HotspotView
