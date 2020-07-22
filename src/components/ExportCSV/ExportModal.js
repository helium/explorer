import React from 'react'
import Client from '@helium/http'
import { Button, Modal } from 'antd'
import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
import { parseTxn } from './utils'
import ExportProgress from './ExportProgress'
import ExportForm from './ExportForm'
import Balance from '@helium/http/build/models/Balance'
import CurrencyType from '@helium/http/build/models/CurrencyType'

const initialState = {
  open: false,
  loading: false,
  done: false,
  startDate: moment(),
  endDate: moment(),
  lastTxnTime: moment().unix(),
}

class ExportModal extends React.Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
  }

  showModal = () => {
    this.setState({
      open: true,
    })
  }

  handleOk = async () => {
    this.setState({ loading: true })
    await this.handleExportCsv()
    this.setState({ done: true, loading: false })
  }

  handleCancel = (e) => {
    this.setState(initialState)
  }

  onChange = (dates) => {
    this.setState({
      startDate: dates[0],
      endDate: dates[1],
    })
  }

  handleExportCsv = async () => {
    const { address } = this.props
    const { startDate, endDate } = this.state

    const list = await this.client.account(address).activity.list({
      // filterTypes: ['rewards_v1', 'payment_v1', 'payment_v2'],
      filterTypes: ['rewards_v1'],
    })

    let data = []

    if (false) {
      for await (const txn of list) {
        if (txn.time < startDate.unix()) break
        if (txn.time <= endDate.unix()) {
          data.push(parseTxn(address, txn))
        }
        this.setState({ lastTxnTime: txn.time })
      }
    } else {
      const dateGroups = {}

      for await (const txn of list) {
        console.log('txn.time', txn.time)
        console.log('startDate', startDate.unix())
        if (txn.time < startDate.unix()) break
        if (txn.time <= endDate.unix()) {
          const month = moment
            .unix(txn.time)
            .utc()
            .startOf('month')
            .format('MM/DD/YYYY HH:MM:SS')
          console.log('month', month)
          if (dateGroups[month]) {
            dateGroups[month] =
              dateGroups[month] + txn.totalAmount.integerBalance
          } else {
            dateGroups[month] = txn.totalAmount.integerBalance
          }
        }
        this.setState({ lastTxnTime: txn.time })
      }
      console.log('dateGroups', dateGroups)

      data = Object.keys(dateGroups).map((date) => {
        const amount = new Balance(dateGroups[date], CurrencyType.default)

        return {
          Date: date,
          'Received Quantity': amount.toString(8).slice(0, -4),
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent Currency': '',
          'Fee Amount': '',
          'Fee Currency': '',
          Tag: 'mined',
        }
      })
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      // showTitle: true,
      // title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    }

    const csvExporter = new ExportToCsv(options)

    console.log('data', data)
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

    console.log('percent', percent)
    console.log('lastTxnTime', lastTxnTime)
    console.log('startTime', startTime)
    console.log('moment unix', moment().unix())

    return (
      <>
        <Button onClick={this.showModal}>Download</Button>
        <Modal
          title="Export Account Activity"
          visible={this.state.open}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {loading || done ? (
            <ExportProgress percent={percent} />
          ) : (
            <ExportForm onDateChange={this.onChange} />
          )}
        </Modal>
      </>
    )
  }
}

export default ExportModal
