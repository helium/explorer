import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Input } from 'antd'
import Client from '@helium/http'
import classNames from 'classnames'

const { Search } = Input

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
      <Search
        enterButton
        onSearch={this.doSearch}
        size="large"
        className="searcher"
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
