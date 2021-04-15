import { useContext } from 'react'
import { store } from './store'

const useDispatch = () => {
  const { dispatch } = useContext(store)

  return dispatch
}

export default useDispatch
