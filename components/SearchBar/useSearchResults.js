import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import client from '../../data/client'
import { Address } from '@helium/crypto'

const useSearchResults = () => {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])

  const searchHotspot = useRef(
    debounce(
      async (term) => {
        try {
          const list = await client.hotspots.search(term)
          const hotspots = (await list.take(20)).map((h) =>
            toSearchResult(h, 'hotspot'),
          )
          setResults([...results, ...hotspots])
        } catch {}
      },
      500,
      { trailing: true },
    ),
  )

  const searchAddress = useRef(
    debounce(
      async (term) => {
        let hotspot
        let account

        try {
          hotspot = await client.hotspots.get(term)
        } catch {}

        try {
          account = await client.accounts.get(term)
        } catch {}

        if (hotspot) {
          setResults([toSearchResult(hotspot, 'hotspot'), ...results])
        } else if (account) {
          setResults([toSearchResult(account, 'account'), ...results])
        }
      },
      500,
      { trailing: true },
    ),
  )

  const searchBlock = useRef(
    debounce(
      async (term) => {
        try {
          const block = await client.blocks.get(term)
          console.log('block', block)
          if (block) {
            setResults([toSearchResult(block, 'block'), ...results])
          }
        } catch {}
      },
      500,
      { trailing: true },
    ),
  )

  const searchTransaction = useRef(
    debounce(
      async (term) => {
        try {
          const txn = await client.transactions.get(term)
          if (txn) {
            setResults([toSearchResult(txn, 'transaction'), ...results])
          }
        } catch {}
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

    if (isPositiveInt(trimmedTerm)) {
      // if term is an integer, assume it's a block height
      searchBlock.current(parseInt(trimmedTerm))
    } else if (Address.isValid(trimmedTerm)) {
      // if it's a valid address, it could be a hotspot or an account
      searchAddress.current(trimmedTerm)
    } else if (trimmedTerm.length > 20 && isBase64Url(trimmedTerm)) {
      // if term is a base64 string, it could be a:
      // block hash
      searchBlock.current(trimmedTerm)
      // transaction hash
      searchTransaction.current(trimmedTerm)
    } else {
      searchHotspot.current(trimmedTerm)
    }
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
