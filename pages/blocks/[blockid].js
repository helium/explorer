import { Typography, Table, Card, Skeleton } from 'antd'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import { TxnTag } from '../../components/Txns'
import AppLayout, { Content } from '../../components/AppLayout'
import PieChart from '../../components/PieChart'
import withBlockHeight from '../../components/withBlockHeight'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { generateFriendlyTimestampString } from '../../components/Txns/utils'
import animalHash from 'angry-purple-tiger'

import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const generateDetails = (txn) => {
  let details = ''

  switch (txn.type) {
    case 'poc_receipts_v1': {
      if (txn.path.length === 1) {
        return (
          <span>
            {`${txn.path.length === 1 ? 'Beacon challenge' : 'Challenge'} for ${
              txn.path.length === 1
                ? animalHash(txn.path[0].challengee)
                : `${txn.path.length} hotspots`
            }`}
          </span>
        )
      }
    }
    case 'poc_request_v1': {
      return <span>{`Challenge by ${animalHash(txn.challenger)}`}</span>
    }
  }
  return details
}

const BlockView = ({ block, txns, height }) => {
  const filterTxns = () => {
    const res = []
    if (txns.length > 0) {
      txns.forEach((t) => {
        let f = res.find((x) => x.name === t.type)
        if (f) {
          f.value++
        } else {
          let n = { name: t.type, value: 1 }
          res.push(n)
        }
      })
    }
    return res
  }

  const txnColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (data, txn) => (
        <Link href={`/txns/${txn.hash}`}>
          <a className="tag-link">
            <TxnTag type={data}></TxnTag>
          </a>
        </Link>
      ),
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash, txn) => {
        console.log(txn)
        return <span>{generateDetails(txn)}</span>
      },
    },
    {
      title: 'Fee (DC)',
      dataIndex: 'fee',
      key: 'fee',
      render: (data) => (
        <span>
          {typeof data === 'object' && data !== null
            ? data.integerBalance
            : data}
        </span>
      ),
    },
  ]

  return (
    <AppLayout
      title={`Block ${block.height.toLocaleString()}`}
      description={`Block ${block.height.toLocaleString()} of the Helium blockchain was produced ${generateFriendlyTimestampString(
        block.time,
      )}, with ${txns.length} transaction${txns.length !== 1 ? 's' : ''}`}
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/blocks.png`}
      url={`https://explorer.helium.com/blocks/${block.height}`}
    >
      <Content
        style={{
          marginTop: 0,
          background: 'rgb(16, 23, 37)',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container"
        >
          <div className="flex-responsive">
            <div style={{ paddingBottom: 30, paddingRight: 30, width: '100%' }}>
              <h3>Block</h3>
              <Title
                style={{
                  color: 'white',
                  fontSize: 52,
                  marginTop: 0,
                  lineHeight: 0.7,
                  letterSpacing: '-2px',
                }}
              >
                {block.height.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Title>
              <div>
                <Text
                  copyable
                  style={{
                    color: '#6A6B93',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                  }}
                >
                  {block.hash}
                </Text>
              </div>
            </div>

            <div>
              <PieChart data={filterTxns()} />
            </div>
          </div>

          <hr />
          <div className="block-view-summary-container">
            {block.height !== 1 ? (
              <Link href={`/blocks/${block.height - 1}`}>
                <a
                  className="button block-view-prev-button"
                  style={{ backgroundColor: '#232c42' }}
                >
                  <BackwardOutlined style={{ marginleft: '-6px' }} /> Previous
                  Block
                </a>
              </Link>
            ) : (
              <span
                className="block-view-next-button"
                style={{
                  width: '139.5px', // the width the "Next block" button takes up
                }}
              />
            )}
            <span className="block-view-summary-info">
              <h3>
                <ClockCircleOutlined
                  style={{ color: '#FFC769', marginRight: 4 }}
                />{' '}
                <Timestamp
                  date={
                    block.hash === 'La6PuV80Ps9qTP0339Pwm64q3_deMTkv6JOo1251EJI'
                      ? 1564436673
                      : block.time
                  }
                />
              </h3>

              {txns.length > 0 && (
                <h3 className="block-view-clock-icon">
                  <CheckCircleOutlined
                    style={{
                      color: '#29D391',
                      marginRight: 8,
                    }}
                  />
                  {block.transactionCount} transactions
                </h3>
              )}
            </span>
            {block.height < height ? (
              <Link href={`/blocks/${block.height + 1}`}>
                <a
                  className="button block-view-next-button"
                  style={{ backgroundColor: '#232c42' }}
                >
                  Next Block <ForwardOutlined style={{ marginRight: '-6px' }} />
                </a>
              </Link>
            ) : (
              <span
                className="block-view-next-button"
                style={{
                  width: '139.5px', // the width the "Next block" button takes up
                }}
              />
            )}
          </div>
        </div>
      </Content>

      <Content
        style={{
          marginTop: '10px',
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        <Card title="Transaction List" style={{ paddingTop: 50 }}>
          <Table
            dataSource={txns}
            columns={txnColumns}
            size="small"
            rowKey="hash"
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      </Content>
      <style jsx="true">{`
        hr {
          border: none;
          width: 100%;
          border-top: 1px solid #494b7b;
          margin: 40px 0;
        }
        .chartplaceholder {
          width: 350px;
          height: 200px;
          background: #383a64;
          border-radius: 10px;
        }
      `}</style>
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
  const { blockid } = params

  const [block, txnList] = await Promise.all([
    client.blocks.get(blockid),
    client.block(blockid).transactions.list(),
  ])

  let txns = []
  for await (const txn of txnList) {
    txns.push(JSON.parse(JSON.stringify(txn)))
  }

  return {
    props: {
      block: JSON.parse(JSON.stringify(block)),
      txns,
    },
  }
}

const WrappedBlockView = withBlockHeight(BlockView)

export default withRouter(WrappedBlockView)
