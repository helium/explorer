import animalHash from 'angry-purple-tiger'
import { Balance, CurrencyType } from '@helium/currency'
const { formatToTimeZone } = require('date-fns-timezone')
import { fromUnixTime } from 'date-fns'

export const findBounds = (arrayOfLatsAndLons) => {
  let minLon = arrayOfLatsAndLons[0].lng
  let maxLon = arrayOfLatsAndLons[0].lng
  let minLat = arrayOfLatsAndLons[0].lat
  let maxLat = arrayOfLatsAndLons[0].lat

  arrayOfLatsAndLons.map((m) => {
    if (m.lng < minLon) minLon = m.lng
    if (m.lng > maxLon) maxLon = m.lng
    if (m.lat < minLat) minLat = m.lat
    if (m.lat > maxLat) maxLat = m.lat
  })

  const mapBounds = [
    [maxLon, maxLat],
    [minLon, minLat],
  ]

  return mapBounds
}

export const generateFriendlyTimestampString = (txnTime) => {
  const timestampInput = fromUnixTime(txnTime)
  const date = formatToTimeZone(timestampInput, 'MMMM Do, YYYY', {
    timeZone: 'Etc/UTC',
    convertTimeZone: true,
  })
  const time = formatToTimeZone(timestampInput, 'h:mm A', {
    timeZone: 'Etc/UTC',
    convertTimeZone: true,
  })

  const timestampString = `on ${date} at ${time} UTC`
  return timestampString
}

export const getMetaTagsForTransaction = (txn, isFallback) => {
  const urlBase = 'https://explorer.helium.com'
  const ogImageUrlBase = `${urlBase}/images/og`
  let metaTags = {}
  let url = urlBase

  let type = ''
  let description = ''
  let ogImageUrl = ''

  const dateString = !isFallback
    ? generateFriendlyTimestampString(txn.time)
    : ''
  let blockString = !isFallback ? `in block ${txn.height.toLocaleString()}` : ''

  if (!isFallback) {
    switch (txn.type) {
      case 'payment_v1': {
        const amountWithFunctions = new Balance(
          txn.amount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Payment`
        description = `A payment of ${amountWithFunctions.toString(
          2,
        )} from account ${txn.payer.substring(
          0,
          5,
        )}... to account ${txn.payee.substring(
          0,
          5,
        )}... ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'payment_v2': {
        const totalAmountWithFunctions = new Balance(
          txn.totalAmount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Payment`
        description =
          txn.payments.length !== 1
            ? `A payment from account ${txn.payer.substring(0, 5)}... to ${
                txn.payments.length
              } accounts totaling ${totalAmountWithFunctions.toString(
                2,
              )} ${dateString} ${blockString}`
            : `A payment of ${totalAmountWithFunctions.toString(
                2,
              )} from account ${txn.payer.substring(
                0,
                5,
              )}... to account ${txn.payments[0].payee.substring(
                0,
                5,
              )}... ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'poc_request_v1': {
        type = `PoC Request`
        description = `A challenge constructed by ${animalHash(
          txn.challenger,
        )} ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_poc_request.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'poc_receipts_v1': {
        type = `PoC Receipt`
        description = `A challenge constructed by ${animalHash(
          txn.challenger,
        )} for ${txn.path.length} other Hotspot${
          txn.path.length === 1 ? '' : 's'
        } ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_poc_receipt.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'rewards_v1': {
        const totalAmountWithFunctions = new Balance(
          txn.totalAmount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Rewards`
        description = `A rewards transaction with ${totalAmountWithFunctions.toString(
          2,
        )} in total rewarded to ${
          txn.rewards.length
        } accounts ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_rewards.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'state_channel_close_v1': {
        type = `State Channel Close`
        description = `A state channel closed transaction ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_state_channel_close.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'state_channel_open_v1': {
        type = `State Channel Open`
        description = `A state channel open transaction ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_state_channel_open.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'assert_location_v1': {
        type = `Assert Location`
        description = `${animalHash(
          txn.gateway,
        )} asserted its location ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_assert_location.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'consensus_group_v1': {
        type = `Consensus Election`
        description = `${txn.members.length} Hotspots were elected to a consensus group ${dateString} ${blockString}`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'add_gateway_v1': {
        type = `Add Hotspot`
        description = `${animalHash(
          txn.gateway,
        )} was added to the Helium blockchain ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_add_hotspot.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      case 'transfer_hotspot_v1': {
        const amountToSellerWithFunctions = new Balance(
          txn.amountToSeller.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Transfer Hotspot`
        description = `Ownership of ${animalHash(
          txn.gateway,
        )} was transferred from account ${txn.seller.substring(
          0,
          5,
        )}... to account ${txn.buyer.substring(
          0,
          5,
        )}... for ${amountToSellerWithFunctions.toString(
          2,
        )} ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn_transfer.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
      default: {
        type = `default`
        description = `A transaction ${dateString} ${blockString}`
        ogImageUrl = `${ogImageUrlBase}/txn.png`
        url = `${urlBase}/txns/${txn.hash}`
        break
      }
    }
  } else {
    type = `default`
    description = `A transaction on the Helium blockchain`
    ogImageUrl = `${ogImageUrlBase}/txn.png`
    url = `${urlBase}`
  }

  metaTags = {
    type,
    description,
    ogImageUrl,
    url,
  }

  return metaTags
}
