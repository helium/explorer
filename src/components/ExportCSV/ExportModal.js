import React from 'react'
import Client from '@helium/http'
import { Button, Modal } from 'antd'
import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
import { parseTxn } from './utils'
import ExportProgress from './ExportProgress'
import ExportForm from './ExportForm'

const initialState = {
  open: false,
  loading: false,
  done: false,
  startDate: moment(),
  endDate: moment().startOf('day'),
  txn: ['payment', 'reward'],
  fee: 'dc',
  lastTxnTime: moment().unix(),
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
      startDate: dates[0],
      endDate: dates[1],
    })
  }

  onTxnChange = (txn) => this.setState({ txn })
  onFeeChange = (e) => this.setState({ fee: e.target.value })

  handleExportCsv = async () => {
    const { address } = this.props
    const { startDate, endDate, txn, fee } = this.state

    const filterTypes = []
    if (txn.includes('payment')) filterTypes.push('payment_v1', 'payment_v2')
    if (txn.includes('reward')) filterTypes.push('rewards_v1')

    const list = await this.client.account(address).activity.list({
      filterTypes,
    })

    let data = []

    for await (const txn of list) {
      if (txn.time < startDate.unix()) break
      if (txn.time <= endDate.unix()) {
        data.push(
          ...[].concat(
            await parseTxn(address, txn, { convertFee: fee === 'hnt' }),
          ),
        )
      }
      this.setState({ lastTxnTime: txn.time })
    }

    const options = {
      filename: 'helium',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    }

    const csvExporter = new ExportToCsv(options)

    csvExporter.generateCsv(data)
  }

  render() {
    const { loading, startDate, lastTxnTime, done } = this.state
    const startTime = startDate.unix()

    const percent = done
      ? 100
      : Math.floor(
          (1 - (lastTxnTime - startTime) / (moment().unix() - startTime)) * 100,
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
