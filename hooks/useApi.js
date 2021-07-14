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

const useApi = (route, options = {}) => {
  const url = [API_BASE, route].join('')

  let initialData

  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(route)
    if (data) {
      initialData = JSON.parse(data)
    }
  }

  return useSWR(url, fetcher, {
    initialData,
    revalidateOnMount: true,
    onFailure: () => {
      localStorage.removeItem(route)
    },
    onSuccess: (data) => {
      localStorage.setItem(route, JSON.stringify(data))
    },
    ...options,
  })
}

export default useApi
