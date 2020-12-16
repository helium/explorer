import moment from 'moment'
import animalHash from 'angry-purple-tiger'

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

export const processTransactionInfo = (txn) => {
  let metaTags = {}
  const urlBase = 'https://explorer.helium.com'
  const ogImageUrlBase = `${urlBase}/images/og`
  const url = `${urlBase}/txns/${txn.hash}`

  let type = ''
  let description = ''
  let ogImageUrl = ''

  let dateString = `on 
  ${moment.utc(moment.unix(txn.time)).format('MMMM Do, YYYY')} at ${moment
    .utc(moment.unix(txn.time))
    .format('h:mm A')} UTC`
  let blockString = `in block ${txn.height.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

  switch (txn.type) {
    case 'payment_v1':
      type = `Payment`
      description = `A payment of ${txn.amount.floatBalance.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} HNT from account ${txn.payer.substring(
        0,
        5,
      )}... to account ${txn.payee.substring(
        0,
        5,
      )}... ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
      break
    case 'payment_v2':
      type = `Payment`
      description =
        txn.payments.length !== 1
          ? `A payment from account ${txn.payer.substring(0, 5)}... to ${
              txn.payments.length
            } accounts totaling ${txn.totalAmount.floatBalance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )} HNT ${dateString} ${blockString}`
          : `A payment of ${txn.payments[0].amount.floatBalance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )} HNT from account ${txn.payer.substring(
              0,
              5,
            )}... to account ${txn.payments[0].payee.substring(
              0,
              5,
            )}... ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
      break
    case 'poc_request_v1':
      type = `PoC Request`
      description = `A challenge constructed by ${animalHash(
        txn.challenger,
      )} ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_poc_request.png`
      break
    case 'poc_receipts_v1':
      type = `PoC Receipt`
      description = `A challenge constructed by ${animalHash(
        txn.challenger,
      )} for ${txn.path.length} other Hotspot${
        txn.path.length === 1 ? '' : 's'
      } ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_poc_receipt.png`
      break
    case 'rewards_v1':
      type = `Rewards`
      description = `A rewards transaction with ${txn.totalAmount.floatBalance.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} total HNT rewarded to ${
        txn.rewards.length
      } accounts ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_rewards.png`
      break
    case 'state_channel_close_v1':
      type = `State Channel Close`
      description = `A state channel closed transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_state_channel_close.png`
      break
    case 'state_channel_open_v1':
      type = `State Channel Open`
      description = `A state channel open transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_state_channel_open.png`
      break
    case 'assert_location_v1':
      type = `Assert Location`
      description = `${animalHash(
        txn.gateway,
      )} asserted its location ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_assert_location.png`
      break
    case 'consensus_group_v1':
      type = `Consensus Election`
      description = `${txn.members.length} Hotspots were elected to a consensus group ${dateString} ${blockString}`
      break
    case 'add_gateway_v1':
      type = `Add Gateway`
      description = `${animalHash(
        txn.gateway,
      )} was added to the Helium blockchain ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn.png`
      break
    case 'transfer_hotspot_v1':
      type = `Transfer Hotspot`
      description = `Ownership of ${animalHash(
        txn.gateway,
      )} was transferred from account ${txn.seller.substring(
        0,
        5,
      )}... to account ${txn.buyer.substring(
        0,
        5,
      )}... for ${txn.amountToSeller.toString()} ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_transfer.png`
      break
    default:
      type = `default`
      description = `A transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn.png`
      break
  }

  metaTags = {
    type,
    description,
    ogImageUrl,
    url,
  }

  return metaTags
}
