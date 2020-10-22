import React, { Component } from 'react'
import classNames from 'classnames'
import { colors } from '../theme'
import moment from 'moment'

export default class Block extends Component {
  render() {
    const { block, activeBlock, toggleActiveBlock } = this.props

    const transaction = (txn) => {
      if (txn === 1) {
        return (
          <div>
            <div>
              <img className="icon" src="/static/img/transactions.svg" /> {txn}{' '}
              Transaction
            </div>
            <style jsx>{`
              .icon {
                position: relative;
                top: 1px;
              }
            `}</style>
          </div>
        )
      } else {
        return (
          <div>
            <div>
              <img className="icon" src="/static/img/transactions.svg" /> {txn}{' '}
              Transactions
            </div>
            <style jsx>{`
              .icon {
                position: relative;
                top: 1px;
              }
            `}</style>
          </div>
        )
      }
    }

    return (
      <div
        className={classNames('block', {
          active: activeBlock && block.height === activeBlock.height,
        })}
        onClick={() => toggleActiveBlock(block)}
      >
        <header className="block-header">
          <div className="block-section">
            <div className="height">
              {Number(block.height).toLocaleString()}
            </div>
          </div>

          <div className="block-info mono">
            <div className="txn">{transaction(block.transactions.length)}</div>
            <div className="time">
              <img className="icon" src="/static/img/time.svg" />{' '}
              {moment(block.time).format('h:mm:ssa M/D/YYYY')}
            </div>
          </div>
        </header>

        <style jsx>{`
          .block {
            margin: 14px;
            margin-bottom: 4px;
            margin-top: 4px;
            background: #263441;
            transition: all 0.2s;
            border-radius: 6px;
            opacity: 0.7;
          }

          .block:hover {
            background: #364858;
          }

          .active {
            transform: scale(1.02);
            background: #3d5061;
            box-shadow: 0 11px 15px 0 #000;
            opacity: 1;
          }

          .block.active {
            color: white;
          }

          .block:not(.active) {
            color: ${colors.gray};
          }

          .height {
            font-size: 16px;
            margin: 5px 0px;
          }

          .block-header {
            padding: 12px;
            cursor: pointer;
            display: flex;
          }

          .block-info {
            font-size: 12px;
            color: ${colors.lightGray};
            margin-left: auto;
            margin-right: 0;
          }

          .icon {
            position: relative;
            top: 1px;
          }

          .txn {
            margin-bottom: 3px;
          }
        `}</style>
      </div>
    )
  }
}
