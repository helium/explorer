import animalHash from 'angry-purple-tiger'
import { Balance, CurrencyType } from '@helium/currency'
import { fromUnixTime, format, addMinutes } from 'date-fns'

export const findBounds = (arrayOfLatsAndLons) => {
  if (arrayOfLatsAndLons.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ]
  } else {
    let minLon = arrayOfLatsAndLons[0].lng
    let maxLon = arrayOfLatsAndLons[0].lng
    let minLat = arrayOfLatsAndLons[0].lat
    let maxLat = arrayOfLatsAndLons[0].lat

    arrayOfLatsAndLons.map((m) => {
      if (m.lng < minLon) minLon = m.lng
      if (m.lng > maxLon) maxLon = m.lng
      if (m.lat < minLat) minLat = m.lat
      if (m.lat > maxLat) maxLat = m.lat
      return null
    })

    const mapBounds = [
      [maxLon, maxLat],
      [minLon, minLat],
    ]

    return mapBounds
  }
}

export const haversineDistance = (lon1, lat1, lon2, lat2) => {
  function toRad(x) {
    return (x * Math.PI) / 180
  }

  var R = 6371

  var x1 = lat2 - lat1
  var dLat = toRad(x1)
  var x2 = lon2 - lon1
  var dLon = toRad(x2)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c

  return d
}

const convertToUtc = (date) => addMinutes(date, date.getTimezoneOffset())

export const generateFriendlyTimestampString = (txnTime) => {
  const timestampInput = convertToUtc(fromUnixTime(txnTime))
  const date = format(timestampInput, 'MMMM do, yyyy')
  const time = format(timestampInput, 'h:mm a')

  return `on ${date} at ${time} UTC`
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
        const amountObject = new Balance(
          txn.amount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Payment`
        description = `A payment of ${amountObject.toString(
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
        const totalAmountObject = new Balance(
          txn.totalAmount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Payment`
        description =
          txn.payments.length !== 1
            ? `A payment from account ${txn.payer.substring(0, 5)}... to ${
                txn.payments.length
              } accounts totaling ${totalAmountObject.toString(
                2,
              )} ${dateString} ${blockString}`
            : `A payment of ${totalAmountObject.toString(
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
      case 'rewards_v1':
      case 'rewards_v2':
      case 'rewards_v3': {
        const totalAmountObject = new Balance(
          txn.totalAmount.integerBalance,
          CurrencyType.networkToken,
        )

        type = `Rewards`
        description = `A rewards transaction with ${totalAmountObject.toString(
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
      case 'assert_location_v2': {
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
        const amountToSellerObject = new Balance(
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
        )}... for ${amountToSellerObject.toString(
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
