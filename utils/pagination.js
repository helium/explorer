import fetch from 'node-fetch'
import qs from 'qs'

const baseURL = 'https://api.helium.io/v1'

const url = (path, params, cursor) => {
  let fullURL = baseURL + path

  if (params || cursor) {
    params = qs.stringify({ ...params, cursor })
    fullURL += `?${params}`
  }
  return fullURL
}

export const fetchAll = async (path, params, acc = [], cursor) => {
  const response = await fetch(url(path, params, cursor))
  const { data, cursor: nextCursor } = await response.json()
  const accData = [...acc, ...data]

  if (nextCursor) {
    const nextData = await fetchAll(path, params, accData, nextCursor)
    return nextData
  }

  return accData
}
