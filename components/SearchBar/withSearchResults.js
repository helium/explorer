import React from 'react'
import Client from '@helium/http'
import { Address } from '@helium/crypto'
import debounce from 'lodash/debounce'

function isBase64Url(term) {
  return term.match(/^[A-Za-z0-9_-]+$/)
}

function isPositiveInt(term) {
  if (!term.match(/^\d+$/)) return false
  const number = parseInt(term)
  return number !== 'NaN' && number > 0
}

const withSearchResults = (WrappedComponent) => {
  class SearchResults extends React.Component {
    state = {
      term: '',
      blockResult: null,
      accountResult: null,
      transactionResult: null,
      hotspotResults: [],
    }

    componentDidMount() {
      this.client = new Client()
    }

    handleSearch = (term) => {
      this.setState({ term })

      const trimmedTerm = term.trim()

      this.searchHotspot(trimmedTerm)

      // if term is an integer, assume it's a block height
      if (isPositiveInt(trimmedTerm)) {
        this.searchBlock(parseInt(trimmedTerm))
      } else {
        this.setState({ blockResult: null })
      }

      // if term is a base64 string, it could be a:
      if (trimmedTerm.length > 20 && isBase64Url(trimmedTerm)) {
        // block hash
        this.searchBlock(trimmedTerm)
        // transaction hash
        this.searchTransaction(trimmedTerm)
      }

      // if term is valid Helium address, it could be an:
      if (Address.isValid(trimmedTerm)) {
        // account address
        this.searchAccount(trimmedTerm)
        // hotspot address
        this.searchHotspotAddress(trimmedTerm)
      } else {
        this.setState({ accountResult: null })
      }
    }

    searchHotspot = debounce(
      async (term) => {
        try {
          const list = await this.client.hotspots.search(term)
          const hotspots = await list.take(20)
          this.setState({ hotspotResults: hotspots })
        } catch {
          this.setState({ hotspotResults: [] })
        }
      },
      200,
      { trailing: true },
    )

    searchHotspotAddress = debounce(
      async (term) => {
        try {
          const hotspot = await this.client.hotspots.get(term)
          this.setState({ hotspotResults: [hotspot] })
        } catch {
          this.setState({ hotspotResults: [] })
        }
      },
      200,
      { trailing: true },
    )

    searchBlock = debounce(
      async (term) => {
        try {
          const block = await this.client.blocks.get(term)
          this.setState({ blockResult: block })
        } catch {
          this.setState({ blockResult: null })
        }
      },
      200,
      { trailing: true },
    )

    searchAccount = debounce(
      async (term) => {
        try {
          const account = await this.client.accounts.get(term)
          this.setState({ accountResult: account })
        } catch {
          this.setState({ accountResult: null })
        }
      },
      200,
      { trailing: true },
    )

    searchTransaction = debounce(
      async (term) => {
        try {
          const txn = await this.client.transactions.get(term)
          this.setState({ transactionResult: txn })
        } catch {
          this.setState({ transactionResult: null })
        }
      },
      200,
      { trailing: true },
    )

    buildResults = () => {
      const {
        term,
        blockResult,
        accountResult,
        transactionResult,
        hotspotResults,
      } = this.state

      const results = []

      if (term === '') return results

      if (blockResult) {
        results.push({
          category: 'Blocks',
          results: [blockResult],
        })
      }

      if (accountResult) {
        results.push({
          category: 'Accounts',
          results: [accountResult],
        })
      }

      if (transactionResult) {
        results.push({
          category: 'Transactions',
          results: [transactionResult],
        })
      }

      if (hotspotResults.length > 0) {
        results.push({
          category: 'Hotspots',
          results: hotspotResults,
        })
      }

      return results
    }

    render() {
      const { term } = this.state

      return (
        <WrappedComponent
          {...this.props}
          searchResults={this.buildResults()}
          searchTerm={term}
          updateSearchTerm={this.handleSearch}
        />
      )
    }
  }
  return SearchResults
}

export default withSearchResults
