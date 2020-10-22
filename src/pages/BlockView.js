import React, { Component } from 'react'
import { Typography, Table, Card } from 'antd'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import AppLayout, { Content } from '../components/AppLayout'
import LoadMoreButton from '../components/LoadMoreButton'
import PieChart from '../components/PieChart'
import withBlockHeight from '../components/withBlockHeight'

import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const PAGE_SIZE = 500

const initialState = {
  block: {},
  txns: [],
  loading: true,
  hasMore: true,
}

class BlockView extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.loadData()
    }
  }

  loadData = async () => {
    const { hash } = this.props.match.params
    await this.setState(initialState)
    const [block, txnList] = await Promise.all([
      this.client.blocks.get(hash),
      this.client.block(hash).transactions.list(),
    ])
    this.txnList = txnList
    this.setState({ block, loading: false })
    this.loadMoreTxns()
  }

  loadMoreTxns = async () => {
    const { txns } = this.state
    const nextTxns = await this.txnList.take(PAGE_SIZE)
    const hasMore = nextTxns.length === PAGE_SIZE
    this.setState({ txns: [...txns, ...nextTxns], hasMore })
  }

  render() {
    const { block, loading, txns, hasMore } = this.state

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
        render: (data) => <TxnTag type={data}></TxnTag>,
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: (hash) => <a href={'/txns/' + hash}>{hash}</a>,
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
      <AppLayout>
        <Content
          style={{
            marginTop: 0,
            background: '#27284B',
          }}
        >
          <div
            style={{ margin: '0 auto', maxWidth: 850 + 40 }}
            className="content-container"
          >
            <div className="flex-responsive">
              <div
                style={{ paddingBottom: 30, paddingRight: 30, width: '100%' }}
              >
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
                  {block.height}
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
              <a
                href={`/blocks/${block.height - 1}`}
                className="button block-view-prev-button"
              >
                <BackwardOutlined style={{ marginleft: '-6px' }} /> Previous
                Block
              </a>
              <span className="block-view-summary-info">
                <h3>
                  <ClockCircleOutlined
                    style={{ color: '#FFC769', marginRight: 4 }}
                  />{' '}
                  <Timestamp
                    date={
                      block.hash ===
                      'La6PuV80Ps9qTP0339Pwm64q3_deMTkv6JOo1251EJI'
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
              {block.height < this.props.height ? (
                <a
                  href={`/blocks/${block.height + 1}`}
                  className="button block-view-next-button"
                >
                  Next Block <ForwardOutlined style={{ marginRight: '-6px' }} />
                </a>
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
          <Card
            loading={loading}
            title="Transaction List"
            style={{ paddingTop: 50 }}
          >
            <Table
              dataSource={txns}
              columns={txnColumns}
              size="small"
              rowKey="hash"
              pagination={false}
              scroll={{ x: true }}
            />
            {hasMore && <LoadMoreButton onClick={this.loadMoreTxns} />}
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
}

const WrappedBlockView = withBlockHeight(BlockView)

export default WrappedBlockView
