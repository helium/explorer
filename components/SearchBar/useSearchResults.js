import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import Fuse from 'fuse.js'
import client from '../../data/client'
import { Address } from '@helium/crypto'
import { API_BASE } from '../../hooks/useApi'
import camelcaseKeys from 'camelcase-keys'

const useSearchResults = () => {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])

  const searchHotspot = useCallback(async (term) => {
    try {
      const list = await client.hotspots.search(term)
      const hotspots = (await list.take(20)).map((h) =>
        toSearchResult(h, 'hotspot'),
      )
      return hotspots
    } catch {}
  }, [])

  const searchValidator = useCallback(async (term) => {
    try {
      const response = await fetch(`${API_BASE}/validators/search?term=${term}`)
      const validators = await response.json()
      return validators.map((v) =>
        toSearchResult(camelcaseKeys(v), 'validator'),
      )
    } catch {}
  }, [])

  const searchName = useCallback(
    async (term) => {
      try {
        const [hotspots, validators] = await Promise.all([
          searchHotspot(term),
          searchValidator(term),
        ])
        const items = [...hotspots, ...validators]
        const fuse = new Fuse(items, {
          includeScore: true,
          keys: ['item.name'],
        })
        const fuseResults = fuse.search(term)
        const sortedItems = fuseResults.map((r) => r.item)
        setResults([...results, ...sortedItems])
      } catch {}
    },
    [results, searchHotspot, searchValidator],
  )

  const searchAddress = useCallback(
    async (term) => {
      let hotspot
      let account
      let validator

      try {
        hotspot = await client.hotspots.get(term)
      } catch {}

      try {
        account = await client.accounts.get(term)
      } catch {}

      try {
        validator = await client.validators.get(term)
      } catch {}

      if (hotspot) {
        setResults([toSearchResult(hotspot, 'hotspot'), ...results])
      } else if (validator) {
        setResults([toSearchResult(validator, 'validator'), ...results])
      } else if (account) {
        setResults([toSearchResult(account, 'account'), ...results])
      }
    },
    [results],
  )

  const searchBlock = useCallback(
    async (term) => {
      try {
        const block = await client.blocks.get(term)
        if (block) {
          setResults([toSearchResult(block, 'block'), ...results])
        }
      } catch {}
    },
    [results],
  )

  const searchTransaction = useCallback(
    async (term) => {
      try {
        const txn = await client.transactions.get(term)
        if (txn) {
          setResults([toSearchResult(txn, 'transaction'), ...results])
        }
      } catch {}
    },
    [results],
  )

  const doSearch = useRef(
    debounce(
      (term) => {
        if (isPositiveInt(term)) {
          // if term is an integer, assume it's a block height
          searchBlock(parseInt(term))
        } else if (Address.isValid(term)) {
          // if it's a valid address, it could be a hotspot or an account
          searchAddress(term)
        } else if (term.length > 20 && isBase64Url(term)) {
          // if term is a base64 string, it could be a:
          // block hash
          searchBlock(term)
          // transaction hash
          searchTransaction(term)
        } else {
          searchName(term.replace(/-/g, ' '))
        }
      },
      500,
      { trailing: true },
    ),
  )

  useEffect(() => {
    if (term === '') {
      setResults([])
      return
    }

    const trimmedTerm = term.trim()
    doSearch.current(trimmedTerm)
  }, [term])

  return { term, setTerm, results }
}

const toSearchResult = (item, type) => {
  const key = makeSearchResultKey(item, type)
  return { type, item, key }
}

const makeSearchResultKey = (item, type) => {
  switch (type) {
    case 'hotspot':
    case 'account':
    case 'validator':
      return item.address

    case 'block':
    case 'transaction':
      return item.hash

    default:
      return 'unknown'
  }
}

function isBase64Url(term) {
  return term.match(/^[A-Za-z0-9_-]+$/)
}

function isPositiveInt(term) {
  if (!term.match(/^\d+$/)) return false
  const number = parseInt(term)
  return number !== 'NaN' && number > 0
}

export default useSearchResults
