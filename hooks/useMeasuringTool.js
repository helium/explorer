import { useCallback, useContext } from 'react'
import {
  SET_MEASUREMENT_START,
  SET_MEASUREMENT_END,
  TOGGLE_MEASUREMENT_TOOL,
  store,
} from '../store/store'
import useDispatch from '../store/useDispatch'

const useMeasuringTool = () => {
  const dispatch = useDispatch()

  const {
    state: { measuring, measurementStart, measurementEnd },
  } = useContext(store)

  const toggleMeasuring = useCallback(() => {
    dispatch({ type: TOGGLE_MEASUREMENT_TOOL })
  }, [dispatch])

  const setStartPoint = useCallback(
    (coords) => {
      dispatch({
        type: SET_MEASUREMENT_START,
        payload: coords,
      })
    },
    [dispatch],
  )

  const setEndPoint = useCallback(
    (coords) => {
      dispatch({
        type: SET_MEASUREMENT_END,
        payload: coords,
      })
    },
    [dispatch],
  )

  const clearPoints = useCallback(() => {
    dispatch({ type: SET_MEASUREMENT_START, payload: null })
    dispatch({ type: SET_MEASUREMENT_END, payload: null })
  }, [dispatch])

  return {
    measuring,
    toggleMeasuring,
    measurementStart,
    measurementEnd,
    setStartPoint,
    setEndPoint,
    clearPoints,
  }
}

export default useMeasuringTool
