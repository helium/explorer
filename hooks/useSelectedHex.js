import { useContext, useCallback } from 'react'
import { useHistory } from 'react-router'
import { h3SetToFeatureCollection } from 'geojson2h3'
import { h3ToGeo } from 'h3-js'
import { store, SET_SELECTED_HEX } from '../store/store'
import useDispatch from '../store/useDispatch'

const useSelectedHex = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    state: { selectedHex },
  } = useContext(store)

  const selectHex = useCallback(
    async (index) => {
      const hex = {
        index,
        feature: h3SetToFeatureCollection([index]),
        center: h3ToGeo(index),
      }

      dispatch({
        type: SET_SELECTED_HEX,
        payload: { ...hex },
      })
      history.push(`/hotspots/hex/${index}`)
    },
    [dispatch, history],
  )

  const clearSelectedHex = useCallback(() => {
    dispatch({ type: SET_SELECTED_HEX, payload: null })
  }, [dispatch])

  return { selectedHex, selectHex, clearSelectedHex }
}

export default useSelectedHex
