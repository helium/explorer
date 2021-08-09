import { useContext, useCallback } from 'react'
import { store, SET_SELECTED_CITY } from '../store/store'
import useDispatch from '../store/useDispatch'
import { fetchApi } from './useApi'
import qs from 'qs'

const useSelectedCity = () => {
  const dispatch = useDispatch()

  const {
    state: { selectedCity },
  } = useContext(store)

  const selectCity = useCallback(
    async (city) => {
      const geometry = await fetchApi(
        '/cities/search?' +
          qs.stringify({
            term: [city.longCity, city.longState, city.longCountry].join(', '),
          }),
      )

      dispatch({
        type: SET_SELECTED_CITY,
        payload: { ...city, geometry },
      })
    },
    [dispatch],
  )

  const clearSelectedCity = useCallback(() => {
    dispatch({ type: SET_SELECTED_CITY, payload: null })
  }, [dispatch])

  return { selectedCity, selectCity, clearSelectedCity }
}

export default useSelectedCity
