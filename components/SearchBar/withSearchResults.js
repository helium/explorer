import React from 'react'
import Client from '@helium/http'
import { Address } from '@helium/crypto'
import algoliasearch from 'algoliasearch'
import debounce from 'lodash/debounce'

const ALGOLIA_APP = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY

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

      const algoliaClient = algoliasearch(ALGOLIA_APP, ALGOLIA_API_KEY)

      this.hotspotsIndex = algoliaClient.initIndex('hotspots')
    }

    handleSearch = (term) => {
      this.setState({ term })

      const trimmedTerm = term.trim()

      // just go ahead and fire off an algolia search
      this.algoliaSearch(trimmedTerm)

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
        // hotspot address, but that's taken care of by algolia
      } else {
        this.setState({ accountResult: null })
      }
    }

    algoliaSearch = async (term) => {
      const { hits: hotspotResults } = await this.hotspotsIndex.search(term)
      this.setState({ hotspotResults })
    }

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
        console.log('searchAccount', term)
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
