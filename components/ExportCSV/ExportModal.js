import React from 'react'
import Client from '@helium/http'
import { Button, Modal, notification } from 'antd'
import { ExportToCsv } from 'export-to-csv'
import { parseTxn } from './utils'
import ExportProgress from './ExportProgress'
import ExportForm from './ExportForm'
import { getUnixTime, startOfDay } from 'date-fns'

const now = new Date()
const initialState = {
  open: false,
  loading: false,
  done: false,
  startDate: getUnixTime(now),
  endDate: getUnixTime(startOfDay(now)),
  txn: ['payment', 'reward'],
  fee: 'dc',
  lastTxnTime: getUnixTime(now),
}

class ExportModal extends React.Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
  }

  showModal = () => this.setState({ open: true })

  handleOk = async () => {
    if (this.state.done) {
      return this.handleCancel()
    }
    this.setState({ loading: true })
    await this.handleExportCsv()
    this.setState({ done: true, loading: false })
  }

  handleCancel = () => this.setState(initialState)

  onDateChange = (dates) => {
    this.setState({
      startDate: getUnixTime(dates[0]),
      endDate: getUnixTime(dates[1]),
    })
  }

  onTxnChange = (txn) => this.setState({ txn })
  onFeeChange = (e) => this.setState({ fee: e.target.value })

  handleExportCsv = async () => {
    const { address, type } = this.props
    const { startDate, endDate, txn, fee } = this.state

    const filterTypes = []
    if (txn.includes('payment')) filterTypes.push('payment_v1', 'payment_v2')
    if (txn.includes('reward')) filterTypes.push('rewards_v1')
    if (txn.includes('transfer')) filterTypes.push('transfer_hotspot_v1')
    if (txn.includes('assert')) filterTypes.push('assert_location_v1')
    if (txn.includes('add')) filterTypes.push('add_gateway_v1')

    let service = null
    let list

    switch (type) {
      case 'account':
        service = this.client.account
        break
      case 'hotspot':
        service = this.client.hotspot
        break
      default:
        break
    }

    if (service !== null) {
      list = await service(address).activity.list({
        filterTypes,
      })
    } else {
      console.error(`A service for export type ${type} needs to be defined.`)
      return
    }

    let data = []

    for await (const txn of list) {
      if (txn.time < startDate) break
      if (txn.time <= endDate) {
        data.push(
          ...[].concat(
            await parseTxn(address, txn, { convertFee: fee === 'hnt' }),
          ),
        )
      }
      this.setState({ lastTxnTime: txn.time })
    }

    const options = {
      filename: `${type === 'account' ? 'Account' : 'Hotspot'} ${address}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    }

    const csvExporter = new ExportToCsv(options)

    if (data.length) {
      csvExporter.generateCsv(data)
    } else {
      notification.info({
        message: 'No data to export',
      })
    }
  }

  render() {
    const { loading, startDate, lastTxnTime, done } = this.state

    const percent = done
      ? 100
      : Math.floor(
          (1 -
            (lastTxnTime - startDate) / (getUnixTime(new Date()) - startDate)) *
            100,
        )

    return (
      <>
        <Button onClick={this.showModal} style={this.props.style}>
          Export CSV
        </Button>
        <Modal
          title="Export Account Activity"
          visible={this.state.open}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {loading || done ? (
            <ExportProgress percent={percent} />
          ) : (
            <ExportForm
              type={this.props.type}
              onDateChange={this.onDateChange}
              onTxnChange={this.onTxnChange}
              onFeeChange={this.onFeeChange}
            />
          )}
        </Modal>
      </>
    )
  }
}

export default ExportModal
