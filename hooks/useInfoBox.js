import { useCallback, useContext } from 'react'
import { store, TOGGLE_INFO_BOX } from '../store/store'
import useDispatch from '../store/useDispatch'

const useInfoBox = () => {
  const dispatch = useDispatch()

  const {
    state: { showInfoBox },
  } = useContext(store)

  const toggleInfoBox = useCallback(() => {
    dispatch({ type: TOGGLE_INFO_BOX })
  }, [dispatch])

  return { showInfoBox, toggleInfoBox }
}

export default useInfoBox
