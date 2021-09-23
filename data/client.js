import Client, { Network } from '@helium/http'

export const TAKE_MAX = 100000

const client = new Client(
  new Network({ baseURL: 'https://gordon.stakejoy.com/api', version: 1 }),
  { retry: 0 },
)

export default client
