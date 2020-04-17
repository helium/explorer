import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Icon, Tag, Table, Card } from 'antd';
import SearchBar from '../components/SearchBar'
import TxnTag from '../components/TxnTag'
const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

class AccountView extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
        account: {},
        activity: [],
        hotspots: [],
        loading: true,
        activityLoading: true,
    }
  }

  componentDidMount() {
    this.loadAccount()
  }

  async loadAccount() {
    let { account, activity, hotspots, activityLoading, loading } = this.state
    const a = await (await fetch("https://api.helium.io/v1/accounts/" + this.props.match.params.address)).json()
    const h = await (await fetch("https://api.helium.io/v1/accounts/" + this.props.match.params.address + "/hotspots")).json()
    fetch("https://api.helium.io/v1/accounts/" + this.props.match.params.address + "/activity")
    .then(res => res.json())
    .then(act => {
      activity = act.data
      activityLoading = false
      this.setState({ activity, activityLoading })
    })
    hotspots = h.data
    account = a.data
    loading = false
    this.setState({ account, hotspots, loading })
  }
    
  render() {
    const { account, hotspots, activity, activityLoading, loading } = this.state;
    const balanceColumns = [
      {
        title: 'HNT',
        dataIndex: 'balance',
        key: 'balance',
        render: data => <span>{data / 100000000} HNT</span>
      },
      {
        title: 'Data Credits',
        dataIndex: 'dc_balance',
        key: 'dc_balance',
        render: data => <span>{data / 100000000} DC</span>
      },
      {
        title: 'Security Tokens',
        dataIndex: 'sec_balance',
        key: 'sec_balance',
        render: data => <span>{data / 100000000} STO</span>
      },
    ]

    const hotspotColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (data, row) => <a href={'/hotspots/' + row.address}>{data}</a>
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
    ]

    const activityColumns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: data => <TxnTag type={data}></TxnTag>
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (txt, txn) => activityAmount(txn)
      },
      {
        title: 'Block Height',
        dataIndex: 'height',
        key: 'height',
      }
    ]

    const activityAmount = (txn) => {
      switch(txn.type) {
        case "payment_v1":
          return <span>{txn.amount / 100000000} HNT</span>
        case "payment_v2":
          let paymentTotal = 0;
          txn.payments.map((p) => paymentTotal += p.amount)
          return <span>{paymentTotal / 100000000} HNT</span>
        case "rewards_v1":
          let rewardsTotal = 0;
          txn.rewards.map((r) => rewardsTotal += r.amount)
          return <span>{rewardsTotal / 100000000} HNT</span>
        default:
          return <span>{txn.amount}</span>
      }
    }

    return(
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
                  <Card title={account.address}>
                    <Table dataSource={[account]} 
                      columns={balanceColumns}
                      size="small" 
                      rowKey="hash"
                      loading={loading}
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: '20px'}}>              
              <Row gutter={8}>
                <Col xs={16} offset={4}>
                  <Card loading={loading} title={'Hotspots'}>
                  <Table dataSource={hotspots} 
                      columns={hotspotColumns}
                      size="small" 
                      rowKey="name"
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: '20px'}}>              
              <Row gutter={8}>
                <Col xs={16} offset={4}>
                  <Card title={'Activity'}>
                  <Table dataSource={activity} 
                      columns={activityColumns}
                      size="small" 
                      rowKey="hash"
                      loading={activityLoading}
                      pagination={{ pageSize: 50 }}
                    />
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

export default AccountView