import { useCallback, useEffect, useState } from 'react'
import client from '../../data/client'
import { Address } from '@helium/crypto'
import { useDebouncedCallback } from 'use-debounce'
import useResultsReducer, { CLEAR_RESULTS, PUSH_RESULTS } from './resultsStore'
import { useMakers } from '../../data/makers'
import Fuse from 'fuse.js'
import geojson2h3 from './geojson2h3'
import { h3SetToFeatureCollection } from 'geojson2h3'
import { h3ToGeo } from 'h3-js'
// todo: name
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { parseAddress } from '../../utils/format'

const useSearchResults = () => {
  const [term, setTerm] = useState('')
  const [results, dispatch] = useResultsReducer()
  const { makers } = useMakers()

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
        const list = await client.validators.search(term)
        const results = (await list.take(20)).map((v) =>
          toSearchResult(v, 'validator'),
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
      const cityResults = cities.map((city) => toSearchResult(city, 'city'))
      dispatch({ type: PUSH_RESULTS, payload: { results: cityResults, term } })
    },
    [dispatch],
  )

  const searchMapAddresses = useCallback(
    async (term) => {
      // https://docs.mapbox.com/help/troubleshooting/address-geocoding-format-guide/
      const parsed = parseAddress(term)

      const geocodingClient = Geocoding({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
      })
      const mapboxResp = await geocodingClient
        .forwardGeocode({
          query: parsed.address,
          limit: 2,
          countries: parsed.countries,
        })
        .send()

      const mapAddressResultsPromise = Promise.all(
        mapboxResp.body.features.map(async (feature) => {
          const geocode = feature.center
          const tinyPolygon = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              // Have to provide a polygon to H3 geocode api
              // Simplest is just a tiny triangle around the address geocode
              coordinates: [
                [
                  [geocode[0] - 1e-4, geocode[1] - 1e-4],
                  [geocode[0] + 1e-4, geocode[1] - 1e-4],
                  [geocode[0], geocode[1] + 1e-4],
                ],
              ],
            },
          }

          const hexagons = geojson2h3.featureToH3Set(tinyPolygon, 8, {
            ensureOutput: true,
          })
          if (hexagons.length === 0) {
            // TODO: log error?
            return
          }
          const index = hexagons[0]

          // TODO: do we need to fetch more pages?
          const hotspots = await (await client.hotspots.hex(index)).take(100)

          const countryContext = feature.context.find(({ id }) =>
            id.includes('country'),
          )

          const countryCode = countryContext ? countryContext.short_code : null

          const hex = {
            index,
            feature: h3SetToFeatureCollection(index),
            center: h3ToGeo(index),
            hotspots: hotspots,
            hotspotCount: hotspots.length,
            placeName: feature.place_name,
            countryCode: countryCode,
            searchText: term, // maybe parsed address here as text to match?
          }
          return toSearchResult(hex, 'hex')
        }),
      )
      const mapAddressResults = await mapAddressResultsPromise
      dispatch({
        type: PUSH_RESULTS,
        payload: { results: mapAddressResults, term },
      })
    },
    [dispatch],
  )

  const searchMaker = useCallback(
    async (term) => {
      const fuse = new Fuse(makers, {
        includeScore: true,
        keys: ['name'],
        minMatchCharLength: 3,
        threshold: 0.3,
      })

      const fuseResults = fuse.search(term)
      const results = fuseResults.map((result) =>
        toSearchResult(result.item, 'maker'),
      )
      dispatch({ type: PUSH_RESULTS, payload: { results, term } })
    },
    [dispatch, makers],
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
        // searchCities(term)
        searchMapAddresses(term)
        searchMaker(term)
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
      return {
        type,
        item,
        key: item.address,
        indexed: item.name.replaceAll('-', ' '),
      }

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
    case 'hex':
      return {
        type,
        item,
        key: item.index,
        indexed: item.placeName,
      }

    case 'maker':
      return { type, item, key: item.address, indexed: item.name }

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
