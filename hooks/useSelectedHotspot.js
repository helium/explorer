import { useContext, useCallback } from 'react'
import { hotspotToRes8 } from '../components/Hotspots/utils'
import client, { TAKE_MAX } from '../data/client'
import { fetchHotspot } from '../data/hotspots'
import { store, SET_SELECTED_HOTSPOT } from '../store/store'
import useDispatch from '../store/useDispatch'
import { haversineDistance } from '../utils/location'

const MAX_WITNESS_DISTANCE_THRESHOLD = 200

async function getWitnesses(hotspotAddress) {
  const list = await client.hotspot(hotspotAddress).witnesses.list()
  const witnesses = await list.take(TAKE_MAX)
  return witnesses.filter(w => !(w.address === hotspotAddress))
}

const useSelectedHotspot = () => {
  const dispatch = useDispatch()

  const {
    state: { selectedHotspot },
  } = useContext(store)

  const selectHotspot = useCallback(
    async (address) => {
      const [hotspot, fetchedWitnesses] = await Promise.all([
        fetchHotspot(address),
        getWitnesses(address),
      ])

      const filteredWitnesses = fetchedWitnesses
        .filter(
          (w) =>
            haversineDistance(hotspot?.lng, hotspot?.lat, w.lng, w.lat) <=
            MAX_WITNESS_DISTANCE_THRESHOLD,
        )
        .map(hotspotToRes8)

      dispatch({
        type: SET_SELECTED_HOTSPOT,
        payload: {
          ...hotspot,
          witnesses: filteredWitnesses,
        },
      })
    },
    [dispatch],
  )

  const clearSelectedHotspot = useCallback(() => {
    dispatch({ type: SET_SELECTED_HOTSPOT, payload: null })
  }, [dispatch])

  return { selectedHotspot, selectHotspot, clearSelectedHotspot }
}

export default useSelectedHotspot
