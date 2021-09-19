import Client, { Network } from '@helium/http'

export const TAKE_MAX = 100000

const client = new Client(
  new Network({ baseURL: 'http://gordon.stakejoy.com:8080', version: 1 }),
  { retry: 0 },
)

export default client
