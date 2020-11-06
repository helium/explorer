import React, { useEffect, useRef } from 'react'
import { withRouter } from 'next/router'
import { AutoComplete, Input } from 'antd'
import withSearchResults from './withSearchResults'
import SearchResultCategory from './SearchResultCategory'
import SearchResultHotspot from './SearchResultHotspot'
import SearchResultBlock from './SearchResultBlock'
import SearchResultAccount from './SearchResultAccount'
import SearchResultTransaction from './SearchResultTransaction'
import KeyboardIcon from './KeyboardIcon'

const { Search } = Input

const buildOptions = (searchResults) => {
  const categoryBuilder = {
    Blocks: {
      route: (r) => `/blocks/${r.height}`,
      Component: SearchResultBlock,
    },
    Accounts: {
      route: (r) => `/accounts/${r.address}`,
      Component: SearchResultAccount,
    },
    Transactions: {
      route: (r) => `/txns/${r.hash}`,
      Component: SearchResultTransaction,
    },
    Hotspots: {
      route: (r) => `/hotspots/${r.address}`,
      Component: SearchResultHotspot,
    },
  }

  return searchResults
    .filter(({ category }) => categoryBuilder[category])
    .map(({ category, results }) => ({
      label: <SearchResultCategory title={category} />,
      options: results.map((r) => {
        const SearchResultComponent = categoryBuilder[category].Component
        return {
          value: categoryBuilder[category].route(r),
          label: <SearchResultComponent {...r} />,
        }
      }),
    }))
}

const SearchBar = ({ router, searchResults, searchTerm, updateSearchTerm }) => {
  const input = useRef()

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const handleKeydown = (event) => {
    // Disable the following keyboard shortcuts when the user is typing
    if (document.activeElement.tagName === 'INPUT') return
    if (document.activeElement.tagName === 'TEXTAREA') return

    if (event.key === '/') {
      event.preventDefault()
      focusSearchBar()
    }
  }

  const focusSearchBar = () => {
    input.current.focus()
  }

  const handleSelect = (value) => {
    router.push(value)
  }

  return (
    <AutoComplete
      style={{
        width: '100%',
        maxWidth: 850,
      }}
      options={buildOptions(searchResults)}
      onSelect={handleSelect}
      onSearch={updateSearchTerm}
      value={searchTerm}
    >
      <Search
        ref={input}
        enterButton
        size="large"
        placeholder="Search for hotspots, hashes, addresses, or blocks"
        style={{
          background: '#27284B',
          border: 'none',
        }}
        allowClear
        suffix={searchTerm ? null : <KeyboardIcon />}
      />
    </AutoComplete>
  )
}

export default withSearchResults(withRouter(SearchBar))
