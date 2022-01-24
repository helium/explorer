import { useContext, useCallback, useState } from 'react'
import { hotspotToRes8 } from '../components/Hotspots/utils'
import client, { TAKE_MAX } from '../data/client'
import { fetchHotspot } from '../data/hotspots'
import { store, SET_SELECTED_HOTSPOT } from '../store/store'
import useDispatch from '../store/useDispatch'
import { haversineDistance } from '../utils/location'

const MAX_WITNESS_DISTANCE_THRESHOLD = 200

async function getWitnessed(hotspotAddress) {
  const list = await client.hotspot(hotspotAddress).witnessed.list()
  const witnessed = await list.take(TAKE_MAX)
  return witnessed.filter((w) => !(w.address === hotspotAddress))
}

const useSelectedHotspot = () => {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState([])

  const {
    state: { selectedHotspot },
  } = useContext(store)

  const selectHotspot = useCallback(
    async (address) => {
      const hotspot = await fetchHotspot(address)
      let witnessed = []
      try {
        const fetchedWitnessed = await getWitnessed(address)
        witnessed = fetchedWitnessed
      } catch (e) {
        console.error(e)
        const newErrors = errors
        newErrors.push(e)
        setErrors(newErrors)
      }

      const filteredWitnessed = witnessed
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
          witnessed: filteredWitnessed,
          errors,
        },
      })
    },
    [dispatch, errors],
  )

  const clearSelectedHotspot = useCallback(() => {
    dispatch({ type: SET_SELECTED_HOTSPOT, payload: null })
  }, [dispatch])

  return { selectedHotspot, selectHotspot, clearSelectedHotspot }
}

export default useSelectedHotspot
