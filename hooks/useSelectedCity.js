import { useContext, useCallback } from 'react'
import { store, SET_SELECTED_CITY } from '../store/store'
import useDispatch from '../store/useDispatch'
import { fetchApi } from './useApi'
import qs from 'qs'
import { useHistory } from 'react-router'

const useSelectedCity = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    state: { selectedCity },
  } = useContext(store)

  const selectCity = useCallback(
    async (city) => {
      const geometry = await fetchApi('v1')(
        '/cities/search?' +
          qs.stringify({
            term: [city.longCity, city.longState, city.longCountry].join(', '),
          }),
      )

      dispatch({
        type: SET_SELECTED_CITY,
        payload: { ...city, geometry },
      })
      history.push(`/hotspots/cities/${city.cityId}`)
    },
    [dispatch, history],
  )

  const clearSelectedCity = useCallback(() => {
    dispatch({ type: SET_SELECTED_CITY, payload: null })
  }, [dispatch])

  return { selectedCity, selectCity, clearSelectedCity }
}

export default useSelectedCity
