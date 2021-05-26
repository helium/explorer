import useSWR from 'swr'

export const API_BASE = 'https://explorer-api.helium.com/api'

const useApi = (route) => {
  const url = [API_BASE, route].join('')
  return useSWR(url)
}

export default useApi
