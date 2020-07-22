import moment from 'moment'
import Balance from '@helium/http/build/models/Balance'
import CurrencyType from '@helium/http/build/models/CurrencyType'

export const parseTxn = (
  ownerAddress,
  txn,
  opts = { groupHotspots: true, convertFee: true },
) => {
  console.log(txn)
  const timestamp = moment.unix(txn.time).utc().format('MM/DD/YYYY HH:MM:SS')
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
        throw new Error('not implemented yet')
        // return txn.rewards.map(({ type, gateway, amount }) => ({
        //   // time,
        //   // height,
        //   type,
        //   gateway,
        //   amount,
        // }))
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
