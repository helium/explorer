import { useCallback, useEffect, useState } from 'react'
import client from '../../data/client'
import { Address } from '@helium/crypto'
import { fetchApi } from '../../hooks/useApi'
import camelcaseKeys from 'camelcase-keys'
import { useDebouncedCallback } from 'use-debounce'
import useResultsReducer, { CLEAR_RESULTS, PUSH_RESULTS } from './resultsStore'

const useSearchResults = () => {
  const [term, setTerm] = useState('')
  const [results, dispatch] = useResultsReducer()

  const searchHotspot = useCallback(
    async (term) => {
      try {
        const list = await client.hotspots.search(term)
        const results = (await list.take(20)).map((h) =>
          h.mode === 'dataonly'
            ? toSearchResult(h, 'dataonly')
            : toSearchResult(h, 'hotspot'),
        )
        dispatch({
          type: PUSH_RESULTS,
          payload: { results, term },
        })
      } catch {}
    },
    [dispatch],
  )

  const searchValidator = useCallback(
    async (term) => {
      try {
        const validators = await fetchApi(`/validators/search?term=${term}`)
        const results = validators.map((v) =>
          toSearchResult(camelcaseKeys(v), 'validator'),
        )
        dispatch({
          type: PUSH_RESULTS,
          payload: { results, term },
        })
      } catch {}
    },
    [dispatch],
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
        dispatch({
          type: PUSH_RESULTS,
          payload: { results: toSearchResult(hotspot, 'hotspot'), term },
        })
      } else if (validator) {
        dispatch({
          type: PUSH_RESULTS,
          payload: { results: toSearchResult(validator, 'validator'), term },
        })
      } else if (account) {
        dispatch({
          type: PUSH_RESULTS,
          payload: { results: toSearchResult(account, 'account'), term },
        })
      }
    },
    [dispatch],
  )

  const searchBlock = useCallback(
    async (term) => {
      try {
        const block = await client.blocks.get(term)
        if (block) {
          dispatch({
            type: PUSH_RESULTS,
            payload: { results: toSearchResult(block, 'block'), term },
          })
        }
      } catch {}
    },
    [dispatch],
  )

  const searchTransaction = useCallback(
    async (term) => {
      try {
        const txn = await client.transactions.get(term)
        if (txn) {
          dispatch({
            type: PUSH_RESULTS,
            payload: { results: toSearchResult(txn, 'transaction'), term },
          })
        }
      } catch {}
    },
    [dispatch],
  )

  const searchCities = useCallback(
    async (term) => {
      const cities = await (await client.cities.list({ query: term })).take(20)
      const cityResults = cities.map((city) =>
        toSearchResult(
          { ...city, hotspotCount: parseInt(city.hotspotCount) },
          'city',
        ),
      )
      dispatch({ type: PUSH_RESULTS, payload: { results: cityResults, term } })
    },
    [dispatch],
  )

  const doSearch = useDebouncedCallback(
    (term) => {
      // dispatch({ type: CLEAR_RESULTS })
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
        searchHotspot(term.replace(/-/g, ' '))
        searchValidator(term.replace(/-/g, ' '))
        searchCities(term)
      }
    },
    500,
    { trailing: true },
  )

  useEffect(() => {
    if (term === '') {
      dispatch({ type: CLEAR_RESULTS })
      return
    }

    const trimmedTerm = term.trim()
    doSearch(trimmedTerm)
  }, [dispatch, doSearch, term])

  return { term, setTerm, results: results[term] || [] }
}

const toSearchResult = (item, type) => {
  switch (type) {
    case 'hotspot':
    case 'dataonly':
    case 'account':
    case 'validator':
      return { type, item, key: item.address, indexed: item.name.replaceAll('-', ' ') }

    case 'block':
    case 'transaction':
      return { type, item, key: item.hash, indexed: item.hash }

    case 'city':
      return {
        type,
        item,
        key: item.cityId,
        indexed: [item.longCity],
      }

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
