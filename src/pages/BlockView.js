import React, { Component } from 'react'
import { Typography, Tag, Table, Card } from 'antd'
import { CodeSandboxOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import AppLayout, { Content } from '../components/AppLayout'
import LoadMoreButton from '../components/LoadMoreButton'
import classNames from 'classnames'
import { BackwardOutlined, ForwardOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';


const { Title, Text } = Typography

const PAGE_SIZE = 20

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
      },
    ]

   



    const paymentColumns = [
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: (hash) => <a href={'/txns/' + hash}>{hash}</a>,
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
      },
    ]

    const pocColumns = [
      {
        title: 'Challenger',
        dataIndex: 'challenger',
        key: 'challenger',
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: (hash) => <a href={'/txns/' + hash}>{hash}</a>,
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
      },
    ]

    return (
      <AppLayout>
        <Content style={{ marginTop: 0, background: '#27284B', padding: '60px 0 30px' }}>
        <div style={{margin: '0 auto', maxWidth: 850}}>
          <div className="flexwrapper">
        <div>
            <h3>Block</h3>
                <Title style={{color: 'white', fontSize: 52, marginTop: 0, lineHeight: 0.7, letterSpacing: '-2px'}}>
                  {block.height}
                </Title>
                <p>
                  <Text copyable style={{color: '#6A6B93', fontFamily: 'monospace'}}>
                    {block.hash}
                  </Text>
                </p>
            </div>

            <div className="chartplaceholder" />
          </div>


            <hr />
            <div className="flexwrapper">
            <a href={`/blocks/${block.height-1}`} className="button"><BackwardOutlined style={{marginleft: '-6px'}}/> Previous Block</a>

            <h3>
              <ClockCircleOutlined style={{color: '#FFC769', marginRight: 4}} /> <Timestamp date={block.time}/>
            </h3>

           {txns.length > 0 && (
              <h3><CheckCircleOutlined style={{color: '#29D391', marginRight: 4}} /> {block.transactionCount} transactions</h3>
            )}
                        <a href={`/blocks/${block.height+1}`} className="button">Next Block <ForwardOutlined style={{marginRight: '-6px'}}/></a>

            </div>
            </div>
        </Content>

        <Content style={{ marginTop: '10px', margin: '0 auto', maxWidth: 850, paddingBottom: 100, }}>
          <Card loading={loading} title="Transaction List" style={{paddingTop: 50}}>
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
         <style jsx>{`

    

     

      hr {
        border: none;
        width: 100%;
        border-top: 1px solid #494B7B;
        margin: 40px 0;
      }

      .chartplaceholder {
        width: 350px;
        height: 200px;
        background: #383A64;
        border-radius: 10px;
      }



      `}</style>

      </AppLayout>
    )
  }
}

export default BlockView
