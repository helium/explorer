import Client, { Network } from '@helium/http'

export const TAKE_MAX = 100000

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

const clientNetwork = () => {
  if (NETWORK === 'testnet') return Network.testnet
  return new Network({ baseURL: 'https://helium-api.stakejoy.com', version: 1 })
}

const client = new Client(clientNetwork(), { retry: 3 })

export default client
