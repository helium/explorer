import { getColor, getName, getTooltip } from '../components/Txns/TxnTag'
import client from './client'

export const fetchTxnDetails = async (txnHash) => {
  const txn = await client.transactions.get(txnHash)

  txn.name = getName(txn.type)
  txn.color = getColor(txn.type)
  txn.tooltip = getTooltip(txn.type)

  if (txn.location) {
    const geocode = await client.locations.get(txn.location)
    txn.geocode = geocode
  }
  return txn
}
