import fetch from 'node-fetch'
import qs from 'qs'

const baseURLs = {
  production: 'https://api.helium.io/v1',
  testnet: 'https://testnet-api.helium.wtf/v1',
}

const url = (path, params, cursor, network) => {
  let fullURL = baseURLs[network] + path
  if (params || cursor) {
    params = qs.stringify({ ...params, cursor })
    fullURL += `?${params}`
  }
  return fullURL
}

export const fetchAll = async (
  path,
  params,
  network = 'production',
  acc = [],
  cursor,
) => {
  const response = await fetch(url(path, params, cursor, network))
  const { data, cursor: nextCursor } = await response.json()
  const accData = [...acc, ...data]

  if (nextCursor) {
    const nextData = await fetchAll(path, params, network, accData, nextCursor)
    return nextData
  }

  return accData
}
