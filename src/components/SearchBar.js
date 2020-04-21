import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Input } from 'antd'
import Client from '@helium/http'

class SearchBar extends Component {
  componentDidMount() {
    this.client = new Client()
  }

  searchBlock = async (term) => {
    try {
      return await this.client.blocks.get(term)
    } catch {}
  }

  searchTransaction = async (term) => {
    try {
      return await this.client.transactions.get(term)
    } catch {}
  }

  searchAccount = async (term) => {
    try {
      return await this.client.accounts.get(term)
    } catch {}
  }

  searchHotspot = async (term) => {
    try {
      return await this.client.hotspots.get(term)
    } catch {}
  }

  doSearch = async (term) => {
    const { history } = this.props
    const cleanTerm = term.trim()
    const [block, txn, account, hotspot] = await Promise.all([
      this.searchBlock(cleanTerm),
      this.searchTransaction(cleanTerm),
      this.searchAccount(cleanTerm),
      this.searchHotspot(cleanTerm),
    ])

    if (block) {
      history.push('/blocks/' + block.hash)
    } else if (txn) {
      history.push('/txns/' + txn.hash)
    } else if (hotspot) {
      history.push('/hotspots/' + hotspot.address)
    } else if (account) {
      history.push('/accounts/' + account.address)
    } else {
      history.push('/error')
    }
  }

  render() {
    return (
      <Row justify="center" style={{ padding: '0 10px' }}>
        <Input.Search
          onSearch={this.doSearch}
          size="large"
          placeholder="Search for a block height, hash, transaction, or address"
          style={{ maxWidth: 600 }}
        />
      </Row>
    )
  }
}

export default withRouter(SearchBar)
