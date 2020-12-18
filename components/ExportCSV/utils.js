import moment from 'moment'
import animalHash from 'angry-purple-tiger'
import Client from '@helium/http'
import { Balance, CurrencyType } from '@helium/currency'

export const parseTxn = async (
  ownerAddress,
  txn,
  opts = { convertFee: true },
) => {
  const timestamp = moment.unix(txn.time).toISOString()
  switch (txn.type) {
    case 'rewards_v1': {
      return txn.rewards.map(({ type, gateway, amount }) => {
        const amountWithFunctions = new Balance(
          amount.integerBalance,
          CurrencyType.networkToken,
        )
        return {
          Date: timestamp,
          'Received Quantity': amountWithFunctions.toString(8).slice(0, -4),
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
        }
      })
    }
    case 'payment_v1': {
      const amountWithFunctions = new Balance(
        txn.amount.integerBalance,
        CurrencyType.networkToken,
      )
      if (ownerAddress === txn.payer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received From': '',
          'Received Currency': '',
          'Sent Quantity': amountWithFunctions.toString(8).slice(0, -4),
          'Sent To': txn.payee,
          'Sent Currency': 'HNT',
          'Fee Amount': await getFee(txn, opts.convertFee),
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'payment',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      } else {
        return {
          Date: timestamp,
          'Received Quantity': amountWithFunctions.toString(8).slice(0, -4),
          'Received From': txn.payer,
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent To': '',
          'Sent Currency': '',
          'Fee Amount': 0,
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'payment',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      }
    }
    case 'payment_v2': {
      if (ownerAddress === txn.payer) {
        const formatMultiplePayeesString = (payments) => {
          const multiplePayees = []
          payments.map((p) => {
            multiplePayees.push(p.payee)
          })
          return multiplePayees.join(', ')
        }
        const amountWithFunctions = new Balance(
          txn.totalAmount.integerBalance,
          CurrencyType.networkToken,
        )
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received From': '',
          'Received Currency': '',
          'Sent Quantity': amountWithFunctions.toString(8).slice(0, -4),
          'Sent To':
            txn.payments.length === 1
              ? txn.payments[0].payee
              : formatMultiplePayeesString(txn.payments),
          'Sent Currency': 'HNT',
          'Fee Amount': await getFee(txn, opts.convertFee),
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'payment',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      } else {
        const amountWithFunctions = new Balance(
          txn.payments.find(
            (p) => p.payee === ownerAddress,
          ).amount.integerBalance,
          CurrencyType.networkToken,
        )
        return {
          Date: timestamp,
          'Received Quantity': amountWithFunctions.toString(8).slice(0, -4),
          'Received From': txn.payer,
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent To': '',
          'Sent Currency': '',
          'Fee Amount': 0,
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'payment',
          Hotspot: '',
          'Reward Type': '',
          Block: txn.height,
        }
      }
    }
    case 'transfer_hotspot_v1': {
      const amountToSellerWithFunctions = new Balance(
        txn.amountToSeller.integerBalance,
        CurrencyType.networkToken,
      )
      if (ownerAddress === txn.buyer) {
        return {
          Date: timestamp,
          'Received Quantity': '',
          'Received From': '',
          'Received Currency': '',
          'Sent Quantity': amountToSellerWithFunctions.toString().slice(0, -4),
          'Sent To': txn.seller,
          'Sent Currency': 'HNT',
          'Fee Amount': await getFee(txn, opts.convertFee),
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'gateway transfer payment',
          Hotspot: txn.gateway ? animalHash(txn.gateway) : '',
          'Reward Type': '',
          Block: txn.height,
        }
      } else {
        return {
          Date: timestamp,
          'Received Quantity': amountToSellerWithFunctions
            .toString()
            .slice(0, -4),
          'Received From': txn.buyer,
          'Received Currency': 'HNT',
          'Sent Quantity': '',
          'Sent To': '',
          'Sent Currency': '',
          'Fee Amount': 0,
          'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
          Tag: 'gateway transfer payment',
          Hotspot: txn.gateway ? animalHash(txn.gateway) : '',
          'Reward Type': '',
          Block: txn.height,
        }
      }
    }
    case 'add_gateway_v1': {
      return {
        Date: timestamp,
        'Received Quantity': '',
        'Received From': '',
        'Received Currency': '',
        'Sent Quantity':
          txn.payer === null
            ? await getFee(
                {
                  height: txn.height,
                  fee: {
                    integerBalance: txn.stakingFee,
                  },
                },
                opts.convertFee,
              )
            : 0,
        'Sent To': txn.payer === null ? 'Helium Network' : '',
        'Sent Currency': opts.convertFee ? 'HNT' : 'DC',
        'Fee Amount':
          txn.payer === null ? await getFee(txn, opts.convertFee) : 0,
        'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
        Tag: 'add gateway payment',
        Hotspot: txn.gateway ? animalHash(txn.gateway) : '',
        'Reward Type': '',
        Block: txn.height,
      }
    }
    case 'assert_location_v1': {
      return {
        Date: timestamp,
        'Received Quantity': '',
        'Received From': '',
        'Received Currency': '',
        'Sent Quantity':
          txn.payer === null
            ? await getFee(
                {
                  height: txn.height,
                  fee: {
                    integerBalance: txn.stakingFee,
                  },
                },
                opts.convertFee,
              )
            : 0,
        'Sent To': txn.payer === null ? 'Helium Network' : '',
        'Sent Currency': opts.convertFee ? 'HNT' : 'DC',
        'Fee Amount':
          txn.payer === null ? await getFee(txn, opts.convertFee) : 0,
        'Fee Currency': opts.convertFee ? 'HNT' : 'DC',
        Tag: 'assert location payment',
        Hotspot: txn.gateway ? animalHash(txn.gateway) : '',
        'Reward Type': '',
        Block: txn.height,
      }
    }
    default: {
      return null
    }
  }
}

const getFee = async ({ height, fee }, convertFee) => {
  if (convertFee) {
    const client = new Client()
    const { price: oraclePrice } = await client.oracle.getPriceAtBlock(height)
    const dcBalance = new Balance(fee.integerBalance, CurrencyType.dataCredit)
    const output = dcBalance
      .toNetworkTokens(oraclePrice)
      .toString(8)
      .slice(0, -4)
    return output
  }

  return fee === 0 ? 0 : fee.integerBalance
}
