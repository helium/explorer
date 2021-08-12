export const DEPRECATED_HELIUM_MAKER_ADDR =
  '14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh'

export const deprecatedHeliumMaker = {
  address: DEPRECATED_HELIUM_MAKER_ADDR,
  name: 'Helium Inc (Old)',
  // the number of gen_gateway_v1 txns in block 1
  // https://explorer.helium.com/blocks/1
  // no reason to fetch this since it will never change
  genesisHotspots: 45,
}

export const getMakerName = async (accountAddress) => {
  if (!accountAddress || accountAddress === undefined) return ''
  if (accountAddress === DEPRECATED_HELIUM_MAKER_ADDR)
    return deprecatedHeliumMaker.name

  const url = `https://onboarding.dewi.org/api/v2/makers`
  const response = await fetch(url)
  const { data: makers } = await response.json()

  const makerMatch = makers.find((m) => m.address === accountAddress)
  const makerName = makerMatch !== undefined ? makerMatch.name : 'Unknown Maker'
  return makerName
}
