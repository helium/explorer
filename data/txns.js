import client from './client'

export const fetchTxnDetails = async (txnHash) => {
  const txn = await client.transactions.get(txnHash)

  txn.name = getName(txn.type)
  txn.color = getColor(txn.type)
  txn.tooltip = getTooltip(txn.type)

  if (txn.location) {
    // TODO: add to helium-js
    const geoRes = await fetch(
      `https://api.helium.io/v1/locations/${txn.location}`,
    )
    const { data: geocode } = await geoRes.json()
    txn.geocode = geocode
  }
  return txn
}
