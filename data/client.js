import Client, { Network } from '@helium/http'

export const TAKE_MAX = 100000

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL
  ? process.env.NEXT_PUBLIC_CLIENT_URL
  : 'https://helium-api.stakejoy.com'

const client = new Client(new Network({ baseURL, version: 1 }), { retry: 3 })

export default client
