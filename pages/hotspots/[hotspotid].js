import React, { useState } from 'react'
import { Row, Typography, Checkbox, Tooltip, Card, Table } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import AppLayout, { Content } from '../../components/AppLayout'
import ActivityList from '../../components/ActivityList'
import Fade from 'react-reveal/Fade'
import HotspotImg from '../../public/images/hotspot.svg'
import Checklist from '../../components/Hotspot/Checklist/Checklist'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const HotspotMapbox = dynamic(() => import('../../components/HotspotMapbox'), {
  ssr: false,
  loading: () => <div style={{ height: 400, width: '100%' }} />,
})

const { Title, Text } = Typography

const HotspotView = ({ hotspot, witnesses, activity }) => {
  const [showWitnesses, setShowWitnesses] = useState(false)

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
          {data?.long_city === null &&
          data?.short_state === null &&
          data?.long_country === null
            ? // The location data didn't load properly
              `No location data`
            : // The hotspot has location data
              `${data?.long_city}, ${
                data?.short_state !== null && data?.short_state !== undefined
                  ? // Add the state if it's included in the data
                    `${data?.short_state}, `
                  : ``
              }${data?.long_country}`}
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
                        backgroundColor: '#1c1d3f',
                        borderRadius: '10px',
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
                        title={`Hotspot is ${(
                          hotspot.block - hotspot.status.height
                        ).toLocaleString()} blocks behind the Helium blockchain`}
                      >
                        <p
                          style={{
                            marginBottom: 0,
                            color: '#8283B2',
                            marginLeft: 10,
                          }}
                        >{`${((hotspot.status.height / hotspot.block) * 100)
                          .toFixed(2)
                          .toLocaleString()}% synced`}</p>
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

          <Checklist
            hotspot={hotspot}
            witnesses={witnesses}
            activity={activity}
          />
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
            dataSource={witnesses}
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

  return {
    props: {
      hotspot: JSON.parse(JSON.stringify(hotspot)),
      // TODO convert to use @helium/http
      witnesses: await fetch(
        `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
      )
        .then((res) => res.json())
        .then((json) => json.data.filter((w) => !(w.address === hotspotid))),
      activity: JSON.parse(JSON.stringify(hotspotActivity)),
    },
    revalidate: 10,
  }
}

export default HotspotView
