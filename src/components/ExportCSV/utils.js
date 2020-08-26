import moment from 'moment'
import Balance from '@helium/http/build/models/Balance'
import CurrencyType from '@helium/http/build/models/CurrencyType'
import animalHash from 'angry-purple-tiger'

export const parseTxn = (
  ownerAddress,
  txn,
  opts = { groupHotspots: true, convertFee: true },
) => {
  console.log(txn)
  const timestamp = moment.unix(txn.time).format('MM/DD/YYYY HH:MM:SS')
  switch (txn.type) {
    case 'rewards_v1':
      if (opts.groupHotspots) {
        return {
          Date: timestamp,
          'Received Quantity': txn.totalAmount.toString(8).slice(0, -4),
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent Currency': '',
          'Fee Amount': '',
          'Fee Currency': '',
          Tag: 'mined',
        }
      } else {
        return txn.rewards.map(({ type, gateway, amount }) => ({
          Date: timestamp,
          'Received Quantity': amount.toString(8).slice(0, -4),
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent Currency': '',
          'Fee Amount': '',
          'Fee Currency': '',
          Tag: 'mined',
          Hotspot: animalHash(gateway),
          'Reward Type': type,
        }))
      }

    case 'payment_v1':
      if (ownerAddress === txn.payer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received Currency': '',
          'Sent Quantity': txn.amount.toString(8).slice(0, -4),
          'Sent Currency': 'HNT',
          'Fee Amount': txn.fee === 0 ? 0 : txn.fee.floatBalance,
          'Fee Currency': 'DC',
          Tag: '',
        }
      } else {
        return {
          Date: timestamp,
          'Received Quantity': txn.amount.toString(8).slice(0, -4),
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent Currency': '',
          'Fee Amount': txn.fee === 0 ? 0 : txn.fee.floatBalance,
          'Fee Currency': 'DC',
          Tag: '',
        }
      }

    case 'payment_v2':
      if (ownerAddress === txn.payer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received Currency': '',
          'Sent Quantity': txn.totalAmount.toString(8).slice(0, -4),
          'Sent Currency': 'HNT',
          'Fee Amount': txn.fee === 0 ? 0 : txn.fee.floatBalance,
          'Fee Currency': 'DC',
          Tag: '',
        }
      } else {
        return {
          Date: timestamp,
          'Received Amount': txn.payments
            .find((p) => p.payee === ownerAddress)
            .amount.toString(8)
            .slice(0, -4),
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent Currency': '',
          'Fee Amount': txn.fee === 0 ? 0 : txn.fee.floatBalance,
          'Fee Currency': 'DC',
          Tag: '',
        }
      }

    default:
      return null
  }
}
