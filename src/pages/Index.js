import React, { Component } from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography, Tag, Table, Card } from 'antd'
import BarChart from '../components/BarChart'
import Fade from 'react-reveal/Fade'
import Client from '@helium/http'

const { Title, Text } = Typography

class Index extends Component {
  state = {
    height: 0,
    volume: 0,
    price: 0,
    circulatingSupply: 0,
    marketCap: 0,
  }

  componentDidMount = async () => {
    let newVolume = 0
    fetch('https://api.coingecko.com/api/v3/coins/helium')
      .then((res) => res.json())
      .then((marketData) => {
        console.log(marketData)
        marketData.tickers.map((t) => {
          newVolume += t.converted_volume.usd
        })
        this.setState({
          volume: newVolume,
          price: marketData.market_data.current_price.usd,
          circulatingSupply: marketData.market_data.circulating_supply,
          marketCap: marketData.market_data.market_cap.usd,
        })
      })

    this.client = new Client()
    const blocks = await this.client.blocks.list()
    const [{ height }] = await blocks.take(1)
    this.setState({ height })
  }

  render() {
    const { price, volume, height, circulatingSupply, marketCap } = this.state

    return (
      <AppLayout>
        <Content
          style={{
            marginTop: 0,
            background: '#27284B',
            padding: '60px 0 20px',
          }}
        >
          <div style={{ margin: '0 auto', maxWidth: 850 }}>
            <div className="flexwrapper">
              <Title
                style={{
                  margin: '0px 0 40px',
                  maxWidth: 550,
                  letterSpacing: '-2px',
                  fontSize: 38,
                  lineHeight: 1,
                  color: 'white',
                }}
              >
                Helium <span style={{ fontWeight: 300 }}>Explorer</span>
              </Title>
            </div>

            <Fade top>
              <div
                style={{
                  background: '#3F416D',
                  borderRadius: 10,
                  padding: '16px 24px',
                  marginBottom: 100,
                }}
              >
                <Row>
                  <Col lg={12}>
                    <h3
                      style={{
                        marginBottom: 20,
                        color: '#1890ff',
                        fontSize: 14,
                      }}
                    >
                      Blockchain Stats
                    </h3>
                    <p className="stat">
                      <span>Block Height:</span>
                      {height.toLocaleString()}
                    </p>
                    <p className="stat">
                      <span>TPS(24hr):</span>NA
                    </p>
                    <p className="stat">
                      <span>Pending Txs:</span>NA
                    </p>
                    <p className="stat">
                      <span>Avg Block Time (24hr):</span>NA
                    </p>
                  </Col>
                  <Col lg={12}>
                    <h3
                      style={{
                        marginBottom: 20,
                        color: '#1890ff',
                        fontSize: 14,
                      }}
                    >
                      Market Stats
                    </h3>
                    <p className="stat">
                      <span>Market Price</span>
                      {price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <p className="stat">
                      <span>Volume (24hr):</span>
                      {volume.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="stat">
                      <span>Circulating Supply:</span>
                      {circulatingSupply.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{' '}
                      HNT
                    </p>
                    <p className="stat">
                      <span>Market Cap:</span>
                      {marketCap.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </Col>
                </Row>
              </div>
            </Fade>

            <div style={{ position: 'relative', width: '100%' }}>
              <BarChart />
            </div>
          </div>
        </Content>

        <Content
          style={{
            marginTop: '50px',
            margin: '0 auto',
            maxWidth: 850,
            paddingBottom: 100,
          }}
        >
          <div style={{ background: 'white', padding: 15 }}>
            <h2 style={{ marginTop: 20 }}>Latest Blocks</h2>
          </div>
          <BlocksList />
        </Content>
      </AppLayout>
    )
  }
}

export default Index
