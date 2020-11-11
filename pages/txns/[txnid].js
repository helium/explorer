import React, { Component } from 'react'
import { Typography, Card, Descriptions } from 'antd'
import { h3Distance } from 'h3-js'

import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../../components/TxnTag'
import PocPath from '../../components/PocPath'
import AppLayout, { Content } from '../../components/AppLayout'
import PieChart from '../../components/PieChart'
import TxnReward from '../../components/TxnReward'
import TxnSCClose from '../../components/TxnSCClose'
import animalHash from 'angry-purple-tiger'
import { Collapse } from 'antd'

import { withRouter } from 'next/router'
import Link from 'next/link'

import { ClockCircleOutlined, WalletOutlined } from '@ant-design/icons'
import Block from '../../public/images/block.svg'

// import { Tooltip } from 'antd'

const { Panel } = Collapse
const { Title, Text } = Typography

class TxnView extends Component {
  state = {
    txn: {},
    loading: true,
    truncated: {},
    h3exclusionCells: 0,
    h3maxHopCells: 99999999,
  }

  componentDidMount() {
    this.client = new Client()
    const { txnid } = this.props.router.query
    if (txnid !== undefined) {
      this.loadTxn(txnid)
      this.loadChainVars()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.router.query !== this.props.router.query) {
      const { txnid } = this.props.router.query
      if (txnid !== undefined) {
        this.loadTxn(txnid)
        this.loadChainVars()
      }
    }
  }

  async loadTxn(txnid) {
    const txn = await this.client.transactions.get(txnid)
    this.setState({ txn, loading: false })

    const truncated = {}
    Object.entries(txn).map(([key, value]) => {
      if (key === 'proof') {
        truncated[key] = true
      }
    })
    this.setState({ truncated })
  }

  async loadChainVars() {
    await fetch('https://api.helium.io/v1/vars/poc_v4_exclusion_cells')
      .then((res) => res.json())
      .then((min) => {
        this.setState({ h3exclusionCells: min.data })
      })
    await fetch('https://api.helium.io/v1/vars/poc_max_hop_cells')
      .then((res) => res.json())
      .then((max) => {
        this.setState({ h3maxHopCells: max.data })
      })
  }

  rewardChart() {
    const { txn } = this.state
    if (txn.type === 'rewards_v1') {
      const res = []
      if (txn.rewards.length > 0) {
        txn.rewards.forEach((t) => {
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
  }

  render() {
    const { txn, loading, truncated } = this.state

    const handleTruncation = (key) => {
      if (key === 'proof') {
        const truncatedCopy = truncated
        truncatedCopy[key] = !truncatedCopy[key]
        this.setState({ truncated: truncatedCopy })
      }
    }

    const txnView = (type) => {
      switch (type) {
        case 'payment_v1':
          return paymentv1()
        case 'payment_v2':
          return paymentv2()
        case 'poc_request_v1':
          return pocRequestv1()
        case 'poc_receipts_v1':
          return pocReceiptsv1()
        case 'rewards_v1':
          return <TxnReward txn={txn} />
        case 'state_channel_close_v1':
          return <TxnSCClose txn={txn} />

        default:
          return (
            <Descriptions bordered>
              {Object.entries(txn).map(([key, value]) => {
                return (
                  <Descriptions.Item label={key} key={key} span={3}>
                    {key === 'members' && typeof value === 'object' ? (
                      <ul className={key}>
                        {value.map((member, index) => {
                          return (
                            <li key={`${key}-${index}`}>
                              <a href={`/hotspots/${member}`}>
                                {animalHash(member)}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    ) : key !== 'members' && typeof value === 'object' ? (
                      <p className={key} id={key}>
                        {JSON.stringify(value)}
                      </p>
                    ) : (
                      <>
                        <p
                          className={key}
                          id={key}
                          style={
                            // if this value in the description is being truncated (set manually in the handleTruncation function above)
                            truncated[key] !== undefined &&
                            truncated[key] === true
                              ? {
                                  // then truncate the text by hiding most of it behind an ellipsis
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '60ch',
                                }
                              : {}
                          }
                        >
                          {value}
                        </p>
                        {truncated[key] !== undefined && (
                          // if this value can be truncated
                          // show a button to toggle truncation on and off again
                          <button onClick={() => handleTruncation(key)}>
                            {truncated[key] === true ? 'Show' : 'Hide'} entire
                            value
                          </button>
                        )}
                      </>
                    )}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          )
      }
    }

    const pocReceiptsv1 = () => (
      <div>
        <PocPath path={txn.path} />
        <Descriptions bordered>
          <Descriptions.Item label="Challenger" span={3}>
            <Link href={'/hotspots/' + txn.challenger}>
              <a>{animalHash(txn.challenger)}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Block Height" span={3}>
            <Link href={'/blocks/' + txn.height}>
              <a>{txn.height}</a>
            </Link>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered layout="vertical">
          <Descriptions.Item label="PoC Path" span={3}>
            <ol>
              {txn.path.map((p, idx) => {
                return (
                  <div key={`${p.receipt}-${idx}`}>
                    <div
                      style={{
                        marginBottom: '0px',
                        paddingTop: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <p
                          style={{
                            backgroundColor: `${
                              p.receipt ||
                              p.witnesses.length > 0 ||
                              (txn.path[idx + 1] &&
                                (txn.path[idx + 1].receipt ||
                                  txn.path[idx + 1].witnesses.length > 0))
                                ? '#09B851'
                                : '#CA0926'
                            }`,
                            color: 'white',
                            width: '22px',
                            heigh: '22px',
                            borderRadius: 22,
                            textAlign: 'center',
                          }}
                        >
                          {idx + 1}
                        </p>
                        <Link href={'/hotspots/' + p.challengee}>
                          <a style={{ paddingLeft: 10 }}>
                            {animalHash(p.challengee)}
                          </a>
                        </Link>
                        {p.receipt && p.receipt.origin === 'radio' && (
                          <span style={{ paddingLeft: 10, color: '#777' }}>
                            {`— received at RSSI ${p.receipt.signal}dBm, SNR ${
                              p.receipt.snr
                                ? `${p.receipt.snr.toFixed(2)}dB`
                                : ''
                            }${
                              p.receipt !== null &&
                              p.receipt.datarate !== undefined
                                ? Array.isArray(p.receipt.datarate)
                                  ? `${
                                      p.receipt.datarate.length > 0
                                        ? `, ${String.fromCharCode.apply(
                                            null,
                                            p.receipt.datarate,
                                          )}`
                                        : ``
                                    }`
                                  : `${
                                      p.receipt.datarate !== null &&
                                      `, ${p.receipt.datarate} `
                                    }`
                                : ``
                            }`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: '30px',
                        backgroundColor: '#eee',
                      }}
                    >
                      {p.witnesses.length > 0 && (
                        <>
                          <Collapse
                            // Uncomment below line to enable witness panel to be shown by default
                            defaultActiveKey={[idx]}
                          >
                            <Panel header="Witnesses" key={idx}>
                              <div style={{ paddingLeft: 20 }}>
                                {p.witnesses.map((w, i) => {
                                  const wDist = h3Distance(
                                    p.challengee_location,
                                    w.location,
                                  )

                                  const h3DistanceMinValid =
                                    this.state.h3exclusionCells <= wDist
                                  const h3DistanceMaxValid =
                                    wDist < this.state.h3maxHopCells

                                  const h3DistanceIsValid =
                                    h3DistanceMinValid && h3DistanceMaxValid

                                  return (
                                    <div
                                      key={`${idx}-${i}`}
                                      style={i !== 0 ? { paddingTop: 16 } : {}}
                                    >
                                      <span>
                                        <span>{i + 1} — </span>
                                        <Link href={'/hotspots/' + w.gateway}>
                                          <a>{animalHash(w.gateway)}</a>
                                        </Link>
                                        <span
                                          style={{
                                            color: w.is_valid
                                              ? '#F1C40F'
                                              : 'grey',
                                            paddingLeft: 10,
                                          }}
                                        >
                                          {w.is_valid
                                            ? '(Valid witness)'
                                            : '(Invalid witness)'}
                                        </span>
                                        <ul>
                                          <li>RSSI: {`${w.signal}dBm`}</li>
                                          {w.snr && (
                                            <li>
                                              {`SNR: ${w.snr.toFixed(2)}dB`}
                                            </li>
                                          )}
                                          {txn.height > 123479 && (
                                            <li>
                                              Distance (h3):{' '}
                                              <span
                                                style={
                                                  !h3DistanceIsValid
                                                    ? { color: '#CA0926' }
                                                    : {}
                                                }
                                              >
                                                {wDist}
                                              </span>
                                              <span
                                                style={
                                                  !h3DistanceIsValid
                                                    ? { color: '#CA0926' }
                                                    : {}
                                                }
                                              >
                                                {!h3DistanceMinValid
                                                  ? ' (too close)'
                                                  : !h3DistanceMaxValid
                                                  ? ' (too far)'
                                                  : ''}
                                              </span>
                                            </li>
                                          )}
                                          {w.datarate !== undefined &&
                                            ((Array.isArray(w.datarate) &&
                                              w.datarate.length > 0) ||
                                              (!Array.isArray(w.datarate) &&
                                                w.datarate !== null)) && (
                                              <li>
                                                Data rate:{' '}
                                                {Array.isArray(w.datarate)
                                                  ? `${
                                                      w.datarate.length > 0
                                                        ? `${String.fromCharCode.apply(
                                                            null,
                                                            w.datarate,
                                                          )}`
                                                        : ``
                                                    } `
                                                  : `${
                                                      w.datarate !== null &&
                                                      `${w.datarate} `
                                                    }`}
                                              </li>
                                            )}
                                        </ul>
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </Panel>
                          </Collapse>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </ol>
          </Descriptions.Item>
        </Descriptions>
      </div>
    )

    const pocRequestv1 = () => {
      return (
        <div>
          <Descriptions bordered>
            <Descriptions.Item label="Hotspot" span={3}>
              <Link href={'/hotspots/' + txn.challenger}>
                <a>{txn.challenger}</a>
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="Owner" span={3}>
              <Link href={'/accounts/' + txn.challengerOwner}>
                <a>{txn.challengerOwner}</a>
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="Block Height" span={3}>
              <Link href={'/blocks/' + txn.height}>
                <a>{txn.height}</a>
              </Link>
            </Descriptions.Item>
            {Object.entries(txn).map(([key, value]) => {
              return (
                <Descriptions.Item label={key} key={key} span={3}>
                  {value}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
      )
    }

    const paymentv1 = () => {
      return (
        <Descriptions bordered>
          <Descriptions.Item
            label="Payer"
            span={3}
            style={{ overflow: 'ellipsis' }}
          >
            <Link href={`/accounts/${txn.payer}`}>
              <a>{txn.payer}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Payee" span={3}>
            <Link href={`/accounts/${txn.payee}`}>
              <a>{txn.payee}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Amount" span={3}>
            {txn.amount.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="Fee" span={3}>
            {txn.fee.toString()}
          </Descriptions.Item>
        </Descriptions>
      )
    }

    const paymentv2 = () => {
      return (
        <Descriptions bordered>
          <Descriptions.Item
            label="Payer"
            span={3}
            style={{ overflow: 'ellipsis' }}
          >
            <Link href={`/accounts/${txn.payer}`}>
              <a>{txn.payer}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Total HNT" span={3}>
            {txn.totalAmount.toString()}
          </Descriptions.Item>
          {txn.payments.map((p, idx) => {
            return (
              <Descriptions.Item label={'Payee ' + Number(idx + 1)} span={3}>
                <Link href={`/accounts/${p.payee}`}>
                  <a>{p.payee}</a>
                </Link>{' '}
                ({p.amount.toString()})
              </Descriptions.Item>
            )
          })}
          <Descriptions.Item label="Fee" span={3}>
            {txn.fee.toString()}
          </Descriptions.Item>
        </Descriptions>
      )
    }

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
            className="content-container-txn-view"
          >
            <div className="flex-responsive">
              <div style={{ paddingRight: 30, width: '100%' }}>
                <Title
                  style={{
                    color: 'white',
                    fontSize: 52,
                    marginTop: 0,
                    lineHeight: 0.7,
                    letterSpacing: '-2px',
                  }}
                >
                  Transaction
                </Title>
                <Text
                  copyable
                  style={{
                    color: '#6A6B93',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                  }}
                >
                  {txn.hash}
                </Text>
                <p style={{ marginTop: 20 }}>
                  <TxnTag type={txn.type} />
                </p>
                <p>
                  <img
                    style={{
                      marginRight: 5,
                      position: 'relative',
                      top: '-1px',
                    }}
                    src={Block}
                    alt="img"
                  />
                  <Link href={'/blocks/' + txn.height}>
                    <a>{txn.height}</a>
                  </Link>
                </p>
                {txn.type === 'rewards_v1' && (
                  <p style={{ color: '#FFC769' }}>
                    <WalletOutlined
                      style={{ color: '#FFC769', marginRight: 6 }}
                    />
                    {txn.totalAmount.toString(2)}
                  </p>
                )}
              </div>

              {txn.type === 'rewards_v1' && (
                <div>
                  <PieChart data={this.rewardChart()} />
                </div>
              )}
            </div>
            <hr />
            <div
              //className="flexwrapper"
              // Temporary styling to center timestamp until next / prev transaction buttons work
              // at which point the flexwrapper class can be turned back on instead
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* TODO: efficiently determine next transaction and previous transaction */}
              {/* <a className="button">
                <BackwardOutlined style={{ marginleft: '-6px' }} /> Previous
                Transaction
              </a> */}

              <h3>
                <ClockCircleOutlined
                  style={{ color: '#FFC769', marginRight: 4 }}
                />{' '}
                <Timestamp date={txn.time} />
              </h3>

              {/* <a className="button">
                Next Transaction{' '}
                <ForwardOutlined style={{ marginRight: '-6px' }} />
              </a> */}
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
          <Card loading={loading}>
            <h2 style={{ padding: '44px 0 10px 24px' }}>Transaction Details</h2>
            {txnView(txn.type)}
          </Card>
        </Content>
      </AppLayout>
    )
  }
}

export default withRouter(TxnView)
