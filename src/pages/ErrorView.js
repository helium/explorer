import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Icon, Tag, Table, Card } from 'antd'
import SearchBar from '../components/SearchBar'
import Timestamp from 'react-timestamp'
const { Title, Text } = Typography
const { Header, Content, Footer } = Layout

class ErrorView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      block: {},
      txns: [],
      paymentTxns: [],
      pocReceiptTxns: [],
      pocRequestTxns: [],
      paymentTxnsToggle: false,
      pocRequestTxnsToggle: false,
      pocReceiptTxnsToggle: false,
      loading: true,
    }
    console.log(this.props.match.params.hash)
  }

  render() {
    return <h1>THAT'S AN ERROR MY FRIENDS</h1>
  }
}

export default ErrorView
