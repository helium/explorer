import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { Input } from 'antd'
import Client from '@helium/http'

const { Search } = Input

class SearchBar extends Component {
  state = {
    hotspots: [],
  }

  componentDidMount() {
    this.client = new Client()
    this.loadHotspots()
  }

  async loadHotspots() {
    const list = await this.client.hotspots.list()
    const allSpots = await list.take(20000)
    this.setState({ hotspots: allSpots })
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

  searchHotspotName = async (term) => {
    const { hotspots } = this.state
    return hotspots.find((o) => o.name === term)
  }

  doSearch = async (term) => {
    const { history } = this.props
    const cleanTerm = term.trim()
    const [block, txn, account, hotspot, hotspotName] = await Promise.all([
      this.searchBlock(cleanTerm),
      this.searchTransaction(cleanTerm),
      this.searchAccount(cleanTerm),
      this.searchHotspot(cleanTerm),
      this.searchHotspotName(cleanTerm),
    ])

    if (block) {
      history.push('/blocks/' + block.hash)
    } else if (txn) {
      history.push('/txns/' + txn.hash)
    } else if (hotspot) {
      history.push('/hotspots/' + hotspot.address)
    } else if (hotspotName) {
      history.push('/hotspots/' + hotspotName.address)
    } else if (account) {
      history.push('/accounts/' + account.address)
    } else {
      history.push('/error')
    }
  }

  render() {
    return (
      <Search
        enterButton
        onSearch={this.doSearch}
        size="large"
        placeholder="Search for a block height, hash, transaction, or address"
        style={{
          width: '100%',
          maxWidth: 850,
          background: '#27284B',
          border: 'none',
        }}
      />
    )
  }
}

export default withRouter(SearchBar)
