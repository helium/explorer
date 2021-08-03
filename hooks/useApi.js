import useSWR from 'swr'

export const API_BASE = 'https://explorer-api.helium.com/api'

const fetcher = async (url) => {
  const response = await fetch(url, {
    headers: {
      'cache-control': 'max-age=60',
    },
  })
  return response.json()
}

const useApi = (route, options = {}, config = { localCache: true }) => {
  const url = [API_BASE, route].join('')

  let initialData

  if (typeof window !== 'undefined' && config.localCache) {
    const data = localStorage.getItem(route)
    if (data) {
      initialData = JSON.parse(data)
    }
  }

  return useSWR(url, fetcher, {
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
