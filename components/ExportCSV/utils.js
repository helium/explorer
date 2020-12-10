import moment from 'moment'
import animalHash from 'angry-purple-tiger'
import Client from '@helium/http'

export const parseTxn = async (
  ownerAddress,
  txn,
  opts = { convertFee: true },
) => {
  const timestamp = moment.unix(txn.time).toISOString()
  switch (txn.type) {
    case 'rewards_v1':
      return txn.rewards.map(({ type, gateway, amount }) => ({
        Date: timestamp,
        'Received Quantity': amount.toString(8).slice(0, -4),
        'Received From': 'Helium Network',
        'Received Currency': 'HNT',
        'Sent Quantity': '',
        'Sent To': '',
        'Sent Currency': '',
        'Fee Amount': '',
        'Fee Currency': '',
        Tag: 'mined',
        Hotspot: gateway ? animalHash(gateway) : '',
        'Reward Type': type,
        Block: txn.height,
      }))

    case 'payment_v1':
      if (ownerAddress === txn.payer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received From': '',
          'Received Currency': '',
          'Sent Quantity': txn.amount.toString(8).slice(0, -4),
          'Sent To': txn.payee,
          'Sent Currency': 'HNT',
          'Fee Amount': await getFee(txn, opts.convertFee),
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: '',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      } else {
        return {
          Date: timestamp,
          'Received Quantity': txn.amount.toString(8).slice(0, -4),
          'Received From': txn.payer,
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent To': '',
          'Sent Currency': '',
          'Fee Amount': 0,
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: '',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      }

    case 'payment_v2':
      if (ownerAddress === txn.payer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received From': '',
          'Received Currency': '',
          'Sent Quantity': txn.totalAmount.toString(8).slice(0, -4),
          'Sent To': txn.payments[0].payee,
          'Sent Currency': 'HNT',
          'Fee Amount': await getFee(txn, opts.convertFee),
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: '',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      } else {
        return {
          Date: timestamp,
          'Received Quantity': txn.payments
            .find((p) => p.payee === ownerAddress)
            .amount.toString(8)
            .slice(0, -4),
          'Received From': txn.payer,
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent To': '',
          'Sent Currency': '',
          'Fee Amount': 0,
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: '',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      }

    default:
      return null
  }
}

const getFee = async ({ height, fee }, convertFee) => {
  if (convertFee) {
    const client = new Client()
    const { price: oraclePrice } = await client.oracle.getPriceAtBlock(height)
    return fee.toNetworkTokens(oraclePrice).toString(8).slice(0, -4)
  }

  return fee === 0 ? 0 : fee.floatBalance
}
