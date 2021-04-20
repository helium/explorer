import fetch from 'node-fetch'

const baseURL = 'https://testnet-api.helium.wtf/v1'

const url = (path, cursor) => {
  let fullURL = baseURL + path
  if (cursor) {
    fullURL += `?cursor=${cursor}`
  }
  return fullURL
}

export const fetchAll = async (path, acc = [], cursor) => {
  const response = await fetch(url(path, cursor))
  const { data, cursor: nextCursor } = await response.json()
  const accData = [...acc, ...data]

  if (nextCursor) {
    const nextData = await fetchAll(path, accData, nextCursor)
    return nextData
  }

  return accData
}
