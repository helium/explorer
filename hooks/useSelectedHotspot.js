import { useContext, useCallback } from 'react'
import { useHistory } from 'react-router'
import { fetchHotspot } from '../data/hotspots'
import { store, SET_SELECTED_HOTSPOT } from '../store/store'
import useDispatch from '../store/useDispatch'
import { haversineDistance } from '../utils/location'

const MAX_WITNESS_DISTANCE_THRESHOLD = 200

async function getWitnesses(hotspotid) {
  const witnesses = await fetch(
    `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
  )
    .then((res) => res.json())
    .then((json) => json.data.filter((w) => !(w.address === hotspotid)))
  return witnesses
}

const useSelectedHotspot = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    state: { selectedHotspot },
  } = useContext(store)

  const selectHotspot = useCallback(
    async (address) => {
      const [hotspot, fetchedWitnesses] = await Promise.all([
        fetchHotspot(address),
        getWitnesses(address),
      ])
      const filteredWitnesses = fetchedWitnesses.filter(
        (w) =>
          haversineDistance(hotspot?.lng, hotspot?.lat, w.lng, w.lat) <=
          MAX_WITNESS_DISTANCE_THRESHOLD,
      )
      dispatch({
        type: SET_SELECTED_HOTSPOT,
        payload: { ...hotspot, witnesses: filteredWitnesses },
      })
      history.push(`/hotspots/${hotspot.address}`)
    },
    [dispatch, history],
  )

  const clearSelectedHotspot = useCallback(() => {
    dispatch({ type: SET_SELECTED_HOTSPOT, payload: null })
  }, [dispatch])

  return { selectedHotspot, selectHotspot, clearSelectedHotspot }
}

export default useSelectedHotspot
