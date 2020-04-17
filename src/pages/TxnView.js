import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Icon, Tag, Table, Card, List } from 'antd';
import SearchBar from '../components/SearchBar'
import Timestamp from 'react-timestamp';
import TxnTag from '../components/TxnTag'
const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

class TxnView extends Component {
  state = {
    txn: {},
    block: {},
    loading: true,
  }

  componentDidMount() {
    this.loadTxn()
  }

  async loadTxn() {
    let { txn, block, loading } = this.state    
    const t = await (await fetch("https://api.helium.io/v1/transactions/" + this.props.match.params.hash)).json()
    txn = t.data
    loading = false
    this.setState({ txn, loading })
    fetch("https://api.helium.io/v1/blocks/" + txn.height)
    .then(res => res.json())
    .then(b => {
      block = b.data
      this.setState({ block })
    })
  }
  
  render() {
    const { txn, block, loading } = this.state;

    const txnView = (type) => {      
      switch(type) {
        case "payment_v1":
          return paymentv1();
        case "payment_v2":
          return paymentv2();
        case "poc_request_v1":
          return pocRequestv1();
        case "rewards_v1":
          return rewardsv1();
        default:
          return <List dataSource={Object.entries(txn).map(([key, value]) => {return key + " " + value})} renderItem={item => <List.Item>{item}</List.Item>}/>
      }
    }

    const pocRequestv1 = () => {
      return (
        <div>
          <img src={"https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-m(" + txn.lng + "," + txn.lat + ")/" + txn.lng + "," + txn.lat + ",11/400x300?access_token=pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA"}/>
          <List dataSource={Object.entries(txn).map(([key, value]) => {return key + " " + value})} renderItem={item => <List.Item>{item}</List.Item>}/>
        </div>
      )
    }

    const rewardsv1 = () => {
      const columns = [
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: data => <TxnTag type={data}></TxnTag>
        },
        {
          title: 'Account',
          dataIndex: 'account',
          key: 'account',
          render: data => <a href={'/accounts/' + data}>{data}</a>
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: data => <span>{data / 100000000} HNT</span>
        },
      ]
      return (
        <div>
          <Table dataSource={txn.rewards} 
            columns={columns}
            size="small" 
            rowKey="payee"
            pagination={{ pageSize: 50 }}
          />       
        </div>
      )
    }

    const paymentv1 = () => {
      const columns = [
        {
          title: 'Payer',
          dataIndex: 'payer',
          key: 'payer',
        },
        {
          title: 'Payee',
          dataIndex: 'payee',
          key: 'payee',
          render: data => <a href={'/accounts/' + data}>{data}</a>
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: data => <span>{data / 100000000} HNT</span>
        },
      ]
      return (
        <div>
          <p><Text>Added in block <a href={'/blocks/' + block.hash}>{txn.height}</a></Text></p>
          <table class>
            <tbody class="ant-table-tbody">
              <tr class="ant-table-row">              
                <td>Payer</td>
                <td>{txn.payer}</td>
              </tr>
              <tr class="ant-table-row">              
                <td>Payee</td>
                <td>{txn.payee}</td>
              </tr>
              <tr class="ant-table-row">              
                <td>Amount</td>
                <td>{txn.amount / 100000000} HNT</td>
              </tr>
              <tr class="ant-table-row">              
                <td>Signature</td>
                <td>{txn.signature}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    const paymentv2 = () => {
      const columns = [
        {
          title: 'Payee',
          dataIndex: 'payee',
          key: 'payee',
          render: data => <a href={'/accounts/' + data}>{data}</a>
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: data => <span>{data / 100000000} HNT</span>
        },
      ]
      let total = 0;
      txn.payments.map((p) => total += p.amount)
      return (
        <div>
          <p><Text>Added in block <a href={'/blocks/' + block.hash}>{txn.height}</a></Text></p>
          <p>Total HNT: {total / 100000000} </p>
          <p>Payer: {txn.payer}</p>
          <Table dataSource={txn.payments} 
            columns={columns}
            size="small" 
            rowKey="payee"
            pagination={{ pageSize: 50 }}
          />       
        </div>
      )
    }

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
                    <Title level={3}><Icon type="dollar" /> {txn.hash}</Title>
                    <Tag color="green"><Timestamp date={txn.time}></Timestamp></Tag>
                    <TxnTag type={txn.type}></TxnTag>
                  </Card>
                </Col>
              </Row>

              <Row gutter={8} style={{ marginTop: '10px'}}>
                  <Col xs={16} offset={4}>
                    <Card loading={loading}>
                      <Title level={4}>Transaction Details</Title>
                      {txnView(txn.type)}
                    </Card>
                  </Col>
                </Row>
            </div>
          </Content>
        </Layout>
      </div>
    )    
  }
}

export default TxnView
