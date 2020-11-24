import useSWR from 'swr'
import sumBy from 'lodash/sumBy'

export const fetchMarket = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/helium')
  const marketData = await response.json()

  return {
    volume: sumBy(marketData.tickers, 'converted_volume.usd'),
    price: marketData.market_data.current_price.usd,
    priceChange: marketData.market_data.price_change_percentage_24h,
  }
}

export const useMarket = (initialData) => {
  const { data, error } = useSWR('market', fetchMarket, {
    initialData,
    refreshInterval: 10000,
  })

  return {
    market: data,
    isLoading: !error && !data,
    isError: error,
  }
}
