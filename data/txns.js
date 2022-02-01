import { getColor, getName, getTooltip } from '../components/Txns/TxnTag'
import client from './client'

export const fetchTxnDetails = async (txnHash, params = {}) => {
  const txn = await client.transactions.get(txnHash, params)

  txn.name = getName(txn.type)
  txn.color = getColor(txn.type)
  txn.tooltip = getTooltip(txn.type)

  if (txn.location) {
    const geocode = await client.locations.get(txn.location)
    txn.geocode = geocode
  }
  return txn
}

export const supplementTxnList = (results) => {
  return results.map((txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        const witnesses = txn.path?.[0]?.witnesses
        const total = witnesses?.length
        const numberOfValidWitnesses = witnesses?.filter(
          (w) => w.isValid,
        )?.length
        const numberOfInvalidWitnesses = total - numberOfValidWitnesses
        return { ...txn, numberOfValidWitnesses, numberOfInvalidWitnesses }
      // case: 'other_txn_type':
      // for supplementing txn data at the source
      default:
        return txn
    }
  })
}
