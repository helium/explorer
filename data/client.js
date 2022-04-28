import Client, { Network } from '@helium/http'

export const TAKE_MAX = 100000

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.helium.io'

const clientNetwork = () => {
  if (NETWORK === 'testnet') return Network.testnet
  return new Network({ baseURL: API_URL, version: 1 })
}

let client = new Client(clientNetwork(), { retry: 3 })

export const updateClient = (options) => {
  client = new Client(clientNetwork(), { retry: 3, ...options })
}

export default client
