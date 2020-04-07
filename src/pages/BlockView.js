import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Icon, Tag, Table, Card } from 'antd';
import SearchBar from '../components/SearchBar'
import TxnTag from '../components/TxnTag'
import Timestamp from 'react-timestamp';
const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

class BlockView extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      block: {},
      txns: [],
      loading: true,
    }
    console.log(this.props)
  }

  componentDidMount() {
    this.loadBlock()
  }

  async getCursors(txns, cursor) {
    const cc = await (await fetch("https://api.helium.io/v1/blocks/hash/" + this.props.match.params.hash +"/transactions?cursor=" + cursor)).json()
    txns.push(...cc.data)
    if (cc.cursor) {
      await this.getCursors(txns, cc.cursor)
    }
  }

  async loadBlock() {
    let { block, txns, loading } = this.state
    const b = await (await fetch("https://api.helium.io/v1/blocks/hash/" + this.props.match.params.hash)).json()
    const t = await (await fetch("https://api.helium.io/v1/blocks/hash/" + this.props.match.params.hash + "/transactions")).json()
    txns.push(...t.data)
    if (t.cursor) { 
      await this.getCursors(txns, t.cursor)
    }
    block = b.data
    loading = false
    this.setState({ block, loading, txns })
  }
  
  render() {
    const { block, loading, txns } = this.state;

    const txnColumns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: data => <TxnTag type={data}></TxnTag>
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: hash => <a href={'/txns/' + hash}>{hash}</a>
      },
      {
        title: 'Fee (DC)',
        dataIndex: 'fee',
        key: 'fee',
      }
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
        render: hash => <a href={'/txns/' + hash}>{hash}</a>
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
      }      
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
        render: hash => <a href={'/txns/' + hash}>{hash}</a>
      },
      {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
      }
    ]

    return (
      <div>
        <Layout>
          <Header>
          <a href ='/'><div className="logo" /></a>
          </Header>

          <Content style={{ padding: '50px' }}>
            <div>
              <Row gutter={8}>
                <Col xs={12} offset={6}>
                    <SearchBar></SearchBar>
                </Col>
              </Row>
            </div>
            
            <div style={{ marginTop: '50px'}}>
              
              <Row gutter={8}>
                <Col xs={16} offset={4}>
                  <Card loading={loading}>
                    <Title><Icon type="block" /> Block {block.height}</Title>
                    <Title level={4}>{this.props.match.params.hash} <Icon type="copy" /></Title>
                    <Tag color="green"><Timestamp date={block.time}></Timestamp></Tag>
                    { txns.length > 0 && ( <Tag color="blue">{txns.length} transactions</Tag> ) }
                  </Card>
                </Col>
              </Row>

              <Row gutter={8} style={{ marginTop: '10px'}}>
                <Col xs={16} offset={4}>
                  <Card loading={loading}>
                    <Title level={4}>Transactions</Title>
                    <Table dataSource={txns} 
                      columns={txnColumns}
                      size="small" 
                      rowKey="hash"
                      pagination={{ pageSize: 50 }}
                    />
                  </Card>
                </Col>
              </Row>
              
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>Helium Systems Inc ©2020</Footer>
        </Layout>
    </div>
    )
  }
}

export default BlockView
