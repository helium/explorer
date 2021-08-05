import useSWR from 'swr'

export const API_BASE = 'https://explorer-api.helium.com/api'

export const fetchApi = async (route) => {
  const url = [API_BASE, route].join('')
  const response = await fetch(url, {
    headers: {
      'cache-control': 'max-age=60',
    },
  })
  return response.json()
}

const useApi = (route, options = {}, config = { localCache: true }) => {

  let initialData

  if (typeof window !== 'undefined' && config.localCache) {
    const data = localStorage.getItem(route)
    if (data) {
      initialData = JSON.parse(data)
    }
  }

  return useSWR(route, fetchApi, {
    initialData,
    revalidateOnMount: true,
    onFailure: () => {
      if (config.localCache) {
        localStorage.removeItem(route)
      }
    },
    onSuccess: (data) => {
      if (config.localCache) {
        localStorage.setItem(route, JSON.stringify(data))
      }
    },
    ...options,
  })
}

export default useApi
