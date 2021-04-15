import { useCallback, useContext } from 'react'
import { SET_MAP_LAYER, store, TOGGLE_MAP_LAYERS } from '../store/store'
import useDispatch from '../store/useDispatch'

const useMapLayer = () => {
  const dispatch = useDispatch()

  const {
    state: { showMapLayers, mapLayer },
  } = useContext(store)

  const toggleMapLayers = useCallback(() => {
    dispatch({ type: TOGGLE_MAP_LAYERS })
  }, [dispatch])

  const setMapLayer = useCallback(
    (layer) => {
      dispatch({ type: SET_MAP_LAYER, payload: layer })
    },
    [dispatch],
  )

  return { showMapLayers, toggleMapLayers, setMapLayer, mapLayer }
}

export default useMapLayer
