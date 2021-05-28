import { useContext, useCallback } from 'react'
import { useHistory } from 'react-router'
import { fetchTxnDetails } from '../data/txns'
import { store, SET_SELECTED_TXN } from '../store/store'
import useDispatch from '../store/useDispatch'

const useSelectedTxn = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    state: { selectedTxn },
  } = useContext(store)

  const selectTxn = useCallback(
    async (hash) => {
      const txn = await fetchTxnDetails(hash)
      dispatch({
        type: SET_SELECTED_TXN,
        payload: { ...txn },
      })
    },
    [dispatch, history],
  )

  const clearSelectedTxn = useCallback(() => {
    dispatch({ type: SET_SELECTED_TXN, payload: null })
  }, [dispatch])

  return { selectedTxn, selectTxn, clearSelectedTxn }
}

export default useSelectedTxn
