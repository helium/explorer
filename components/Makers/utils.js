import Client from '@helium/http'

export const DEPRECATED_HELIUM_MAKER_ADDR =
  '14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh'

export const MAKER_INTEGRATION_TEST_ADDR =
  '138LbePH4r7hWPuTnK6HXVJ8ATM2QU71iVHzLTup1UbnPDvbxmr'

export const deprecatedHeliumMaker = {
  address: DEPRECATED_HELIUM_MAKER_ADDR,
  name: 'Helium Inc (Old)',
  // the number of gen_gateway_v1 txns in block 1
  // https://explorer.helium.com/blocks/1
  // no reason to fetch this since it will never change
  genesisHotspots: 45,
}

export const getMakersData = async () => {
  const client = new Client()

  const makersResponse = await fetch(
    `https://onboarding.dewi.org/api/v2/makers`,
  )
  const { data: makersArray } = await makersResponse.json()

  // Add old Helium maker address
  makersArray.push(deprecatedHeliumMaker)

  // Hide maker integration test address
  const makers = makersArray.filter(
    (m) => m.address !== MAKER_INTEGRATION_TEST_ADDR,
  )

  await Promise.all(
    makers.map(async (maker) => {
      const makerInfo = await client.accounts.get(maker.address)
      maker.balanceInfo = JSON.parse(JSON.stringify(makerInfo))

      const MAX_TXNS = 50000

      const addGatewayTxnsList = await client
        .account(maker.address)
        .activity.list({
          filterTypes: ['add_gateway_v1'],
        })
      const assertLocationTxnsList = await client
        .account(maker.address)
        .activity.list({
          filterTypes: ['assert_location_v1'],
        })

      const addGatewayTxns = await addGatewayTxnsList.take(MAX_TXNS)
      const assertLocationTxns = await assertLocationTxnsList.take(MAX_TXNS)

      const makerTxns = {
        addGatewayTxns: addGatewayTxns.length,
        assertLocationTxns: assertLocationTxns.length,
      }
      maker.txns = JSON.parse(JSON.stringify(makerTxns))

      return maker
    }),
  )

  return makers
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

export const getMakerInfo = async (payerAddress, ownerAddress) => {
  if (payerAddress === ownerAddress || payerAddress === null) {
    return 'Hotspot Owner'
  } else {
    const makerName = await getMakerName(payerAddress)
    return makerName
  }
}
