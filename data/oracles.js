import useSWR from 'swr'
import fetch from 'node-fetch'

// TODO add price list to helium-js #yolo
export const fetchOraclePrices = async () => {
  const prices = []
  const response = await fetch(
    `https://api.helium.io/v1/oracle/prices/`,
  )
  var { data: data, cursor: cursor } = await response.json()
  const now = new Date();
  var failsafe = 0;
  while(true) {
    if (failsafe++ >= 20) {
      return prices;
    }
    const response = await fetch(
      `https://api.helium.io/v1/oracle/prices?cursor=${cursor}`,
    )
    const {data: dataR, cursor: cursorR} = await response.json()
    data = dataR;
    cursor = cursorR;

    for (const el of data) {
      const fromEl = new Date(el.timestamp);
      const diff = now.getTime() - fromEl.getTime();
      const MILLISECONDS_IN_A_DAY = 1000 * 3600 * 24
      const diffInDays = Math.floor(diff / MILLISECONDS_IN_A_DAY);
      if (diffInDays <= 30) {
        prices.push(el)
      } else {
        return prices
      }
    }
  }
  return prices
}

export const useOraclePrices = (initialData) => {
  const fetcher = () => fetchOraclePrices()
  const { data, error } = useSWR('latestOraclePrices', fetcher, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    oraclePrices: data,
    isLoading: !error && !data,
    isError: error,
  }
}
