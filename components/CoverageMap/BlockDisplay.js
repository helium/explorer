import React, { Component } from 'react'
import classNames from 'classnames'
import { SidebarHeader, SidebarScrollable } from './Sidebar'
import lowerCase from 'lodash/lowerCase'
import Block from './Block'
import { colors } from '../theme'
import { humanizeAddress } from '../util'
import moment from 'moment'

const BlockBar = ({ autoHeight = false, children }) => (
  <aside className={classNames({ autoHeight })}>
    {children}
    <style jsx>{`
      aside {
        position: fixed;
        background: #2d3c4e;
        bottom: 40px;
        left: 480px;
        top: 150px;
        right: 40px;
        display: flex;
        flex-direction: column;
        z-index: 1;
        border-radius: 10px;
        overflow: hidden;
      }

      aside.autoHeight {
        bottom: auto;
      }
    `}</style>
  </aside>
)

export default class BlockDisplay extends Component {
  render() {
    const { blocks, activeBlock } = this.props

    const transaction = (txn) => {
      if (txn === 1) {
        return (
          <div className="txn-header">
            <img className="icon" src={'/static/img/transactions.svg'} /> {txn}{' '}
            Transaction
          </div>
        )
      } else {
        return (
          <div className="txn-header">
            <img className="icon" src="/static/img/transactions.svg" /> {txn}{' '}
            Transactions
          </div>
        )
      }
    }

    const TransactionTable = (txns) => {
      return (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table>
              <thead>
                <tr className="table-headings">
                  <th width="10%">Type</th>
                  <th width="30%">Details</th>
                  <th width="10%">Amount</th>
                  <th width="10%">Fee</th>
                  <th width="40%">Hash</th>
                </tr>
              </thead>
              <tbody>{renderTransactionData(txns)}</tbody>
            </table>
          </div>
          <style jsx>{`
            .table-wrapper {
              position: relative;
              height: calc(100% - 118px);
            }

            .table-scroll {
              height: 100%;
              overflow: auto;
            }

            .table-wrapper thead th {
              position: sticky;
              top: 0;
            }

            table {
              margin: 0px 12px 12px 12px;
              border-collapse: separate;
              border-spacing: 0 12px;
              width: 100%;
            }

            table tr:first-child {
              border-top: 0;
            }

            th {
              color: white;
              text-transform: uppercase;
              font-size: 12px;
              padding: 2px 0px 2px 10px;
              text-align: left;
            }
          `}</style>
        </div>
      )
    }

    const GetTxnAmount = (txn) => {
      if (txn.amount !== undefined) {
        return <div>{txn.amount / 100000000} HNT</div>
      } else {
        return <div>-</div>
      }
    }

    const GetTxnFee = (txn) => {
      if (txn.fee !== undefined) {
        return <div>{txn.fee} DC</div>
      } else {
        return null
      }
    }

    const renderTransactionData = (txns) => {
      return txns.map((txn) => (
        <React.Fragment key={txn.hash}>
          <tr className="data mono">
            <td>
              <span className="txn-type">{GetTxnType(txn.type)}</span>
            </td>
            <td>{GetTxnDetails(txn)}</td>
            <td>{GetTxnAmount(txn)}</td>
            <td>{GetTxnFee(txn)}</td>
            <td>{txn.hash}</td>
          </tr>
          <style>{`
            .data {
              color: ${colors.lightGray};
              font-size: 12px;
              margin: 14px;
              background: none;
              transition: all 0.2s;
            }

            .data > td {
              border-top: 1px solid #3F5268;
            }

            .data::last > td {
              border-bottom: 1px solid #3F5268;
            }

            .table-headings {
              width: 100%;
            }

            .data:hover {
              color: white;
              cursor: pointer;
            }

            td {
              word-break: break-word;
              padding: 10px;
            }

            .txn-type {
              white-space: nowrap;
            }
          `}</style>
        </React.Fragment>
      ))
    }

    const GetTxnType = (type) => {
      switch (type) {
        case 'payment':
          return 'Payment'
        case 'gateway':
          return 'Add Hotspot'
        case 'location':
          return 'Confirm Location'
        case 'coinbase':
          return 'Coinbase Transaction'
        case 'poc_request':
          return 'Challenge Request'
        case 'poc_receipts':
          return 'Challenge Result'
        case 'security':
          return 'Security Token'
        case 'election':
          return 'Election'
        case 'rewards':
          return 'Rewards'
        case 'data_credit':
          return 'Data Credit'
        default:
          return type
      }
    }

    const GetTxnDetails = (txn) => {
      switch (txn.type) {
        case 'payment':
          return (
            <div>
              <div>
                {txn.payer} &rarr; {txn.payee}
              </div>
            </div>
          )
        case 'gateway':
          return <div>{humanizeAddress(txn.owner)} &rarr; Helium Network</div>
        case 'location':
          return <div>{humanizeAddress(txn.owner)}</div>
        case 'coinbase':
          return (
            <div>
              <div>Helium Network &rarr; {txn.payee}</div>
              <div>{txn.amount}</div>
            </div>
          )
        case 'poc_request':
          return <div>{humanizeAddress(txn.challenger)}</div>
        case 'poc_receipts':
          return <div>{humanizeAddress(txn.challenger)}</div>
        case 'security':
          return <div>{txn.payee}</div>
        default:
          return ''
      }
    }

    return (
      <BlockBar>
        {activeBlock && (
          <SidebarHeader>
            <div className="header-subtitle">Block {activeBlock.height}</div>
            <div className="subtitle mono">
              {/*<img className="icon" src="/static/img/hash.svg" /> {shortenHash(activeBlock.hash)}*/}
              <img className="icon" src="/static/img/hash.svg" />{' '}
              {activeBlock.hash}
            </div>
            <div className="subtitle mono">
              {activeBlock && transaction(activeBlock.transactions.length)}
            </div>
            <div className="subtitle mono">
              <img className="icon" src="/static/img/time.svg" />{' '}
              {moment(activeBlock.time).format('h:mm:ssa M/D/YYYY')}
            </div>
          </SidebarHeader>
        )}

        {activeBlock &&
          activeBlock.transactions.length > 0 &&
          TransactionTable(activeBlock.transactions)}

        <style jsx>{`
          .header-title-section {
            display: flex;
            align-items: center;
          }

          .header-title {
            color: #29d391;
            font-size: 60px;
            font-weight: 500;
            margin-right: 20px;
          }

          .header-subtitle {
            color: #fff;
            font-size: 18px;
            font-weight: 500;
            max-width: 100px;
            line-height: normal;
            word-break: break-word;
            margin-bottom: 20px;
          }

          .subtitle {
            font-size: 12px;
            color: ${colors.lightGray};
            margin-top: 3px;
            word-break: break-word;
          }

          .transaction-columns {
            display: flex;
            color: white;
            text-transform: uppercase;
            font-size: 12px;
            margin: 0px 26px 0px 26px;
            padding: 10px 0px 8px 0px;
          }

          .transaction {
            overflow: scroll;
          }

          .type {
            width: 18.8%;
            padding: 0px 5px;
          }

          .details {
            width: 42.3%;
            padding: 0px 5px;
          }

          .fee {
            width: 9.3%;
            padding: 0px 5px;
          }

          .hash {
            width: 25%;
            padding: 0px 5px;
          }
        `}</style>
      </BlockBar>
    )
  }
}
