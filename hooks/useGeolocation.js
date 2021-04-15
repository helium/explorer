import { useCallback, useContext } from 'react'
import {
  store,
  SET_CURRENT_POSITION,
  SET_CURRENT_POSITION_LOADING,
} from '../store/store'
import useDispatch from '../store/useDispatch'

const useGeolocation = () => {
  const dispatch = useDispatch()

  const {
    state: {
      geolocation: { currentPosition, isLoading },
    },
  } = useContext(store)

  const requestCurrentPosition = useCallback(() => {
    dispatch({ type: SET_CURRENT_POSITION_LOADING })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch({ type: SET_CURRENT_POSITION, payload: position })
      },
      (error) => {
        console.error(error)
        dispatch({ type: SET_CURRENT_POSITION_LOADING, payload: false })
      },
    )
  }, [dispatch])

  return { currentPosition, isLoading, requestCurrentPosition }
}

export default useGeolocation
