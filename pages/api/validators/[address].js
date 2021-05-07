import camelcaseKeys from 'camelcase-keys'
import { getCache } from '../../../utils/cache'
import { fetchAll } from '../../../utils/pagination'

const fetchGeo = (ipAddress) => async () => {
  const response = await fetch(
    `https://tools.keycdn.com/geo.json?host=${ipAddress}`,
    {
      headers: { 'User-Agent': 'keycdn-tools:https://explorer.helium.com' },
    },
  )
  const {
    data: { geo },
  } = await response.json()
  return geo
}

const getGeo = async (validator) => {
  const listenAddrs = validator?.status?.listen_addrs
  if (listenAddrs && listenAddrs.length > 0) {
    const match = listenAddrs[0].match(/\ip4\/(.*)\/tcp\/2154/)
    if (match) {
      const ipAddress = match[1]
      return getCache(`geo:${ipAddress}`, fetchGeo(ipAddress), {
        expires: false,
      })
    }
  }
}

export const fetchValidator = async (address) => {
  const response = await fetch(
    `https://testnet-api.helium.wtf/v1/validators/${address}`,
  )
  const { data } = await response.json()
  const validator = camelcaseKeys(data)
  const elected = await fetchAll('/validators/elected', undefined, 'testnet')
  const electedAddresses = elected.map((e) => e.address)
  const geo = await getGeo(validator)
  // const rewards = await getRewards(v)
  return {
    ...validator,
    geo: geo || {},
    // geo: {},
    elected: electedAddresses.includes(validator.address),
    rewards: {
      // month: rewards,
      month: 0,
    },
  }
}

export default async function handler(req, res) {
  const {
    query: { address },
  } = req

  const validator = await fetchValidator(address)
  res.status(200).send(validator)
}
