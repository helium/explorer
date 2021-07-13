import { SYNC_BUFFER_BLOCKS } from '../components/Hotspots/utils'
import client from './client'

export const getActivityForChecklist = async (address) => {
  const [
    challengerTxnList,
    challengeeTxnList,
    rewardTxnsList,
  ] = await Promise.all([
    // Get most recent challenger transaction
    client.hotspot(address).activity.list({
      filterTypes: ['poc_request_v1'],
    }),
    // Get most recent challengee transaction
    client.hotspot(address).activity.list({
      filterTypes: ['poc_receipts_v1'],
    }),
    // Get most recent rewards transactions to search for witness / data activity
    client.hotspot(address).activity.list({
      filterTypes: ['rewards_v1', 'rewards_v2'],
    }),
  ])
  const [challengerTxn, challengeeTxn, rewardTxns] = await Promise.all([
    challengerTxnList.take(1),
    challengeeTxnList.take(1),
    rewardTxnsList.take(200),
  ])

  let witnessTxn = null
  // most recent witness transaction
  rewardTxns.some((txn) => {
    return txn.rewards.some((txnReward) => {
      if (txnReward.type === 'poc_witnesses') {
        witnessTxn = txn
      }
      return null
    })
  })
  let dataTransferTxn = null
  // most recent data credit transaction
  rewardTxns.some(function (txn) {
    return txn.rewards.some((txnReward) => {
      if (txnReward.type === 'data_credits') {
        dataTransferTxn = txn
      }
      return null
    })
  })
  return {
    challengerTxn: challengerTxn.length === 1 ? challengerTxn[0] : null,
    challengeeTxn: challengeeTxn.length === 1 ? challengeeTxn[0] : null,
    witnessTxn: witnessTxn,
    dataTransferTxn: dataTransferTxn,
  }
}

export const getChecklistItems = (
  hotspot,
  witnesses,
  activity,
  height,
  syncHeight,
  loading,
) => {
  if (loading) return [{ sortOrder: 0 }]
  return [
    {
      sortOrder: 0,
      title: 'Blockchain Sync',
      infoTooltipText: `Hotspots must be fully synced before they can mine. New Hotspots can take up to 96 hours to sync.`,
      detailText:
        isNaN(syncHeight) || isNaN(height)
          ? `Hotspot is not yet synced.`
          : height - syncHeight < SYNC_BUFFER_BLOCKS
          ? `Hotspot is fully synced.`
          : `Hotspot is ${(height - syncHeight).toLocaleString()} block${
              height - syncHeight === 1 ? '' : 's'
            } behind the Helium blockchain and is roughly ${(
              (syncHeight / height) *
              100
            )
              .toFixed(2)
              .toLocaleString()}% synced.`,
      completed: height - syncHeight < SYNC_BUFFER_BLOCKS,
    },
    {
      sortOrder: 1,
      title: 'Hotspot Status',
      infoTooltipText: 'Hotspots must be online to sync and mine.',
      detailText:
        hotspot.status.online === 'online' ? (
          `Hotspot is online.`
        ) : (
          <p>
            Hotspot is offline.{' '}
            <a
              href="https://intercom.help/heliumnetwork/en/articles/3207912-troubleshooting-network-connection-issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our troubleshooting guide.
            </a>
          </p>
        ),
      completed: hotspot.status.online === 'online',
    },
    {
      sortOrder: 2,
      title: 'Create a Challenge',
      infoTooltipText:
        'Hotspots that are synced and online create a challenge automatically, every 480 blocks (~8 hours).',
      detailText:
        activity.challengerTxn !== null
          ? `Hotspot issued a challenge ${(
              height - activity.challengerTxn.height
            ).toLocaleString()} block${
              height - activity.challengerTxn.height === 1 ? '' : 's'
            } ago.`
          : `Hotspot hasn’t issued a challenge yet. Hotspots create challenges automatically every 480 blocks (~8 hours).`,
      completed: activity.challengerTxn !== null,
    },
    {
      sortOrder: 3,
      title: 'Witness a Challenge',
      detailText:
        activity.witnessTxn !== null
          ? // TODO: make this message more specific (e.g. add: "x blocks ago") once the API has been updated to make that number easier to get
            `Hotspot has witnessed a challenge recently.`
          : `Hotspot hasn't witnessed a challenge recently.`,
      infoTooltipText:
        'Hotspots that are synced and online automatically witness challenges if they’re in range of other Hotspots. If there are no Hotspots nearby, they will not be able to witness.',
      completed: activity.witnessTxn !== null,
    },
    {
      sortOrder: 4,
      title: 'Witnesses',
      detailText:
        witnesses?.length > 0
          ? `Hotspot has been witnessed by ${witnesses.length} Hotspot${
              witnesses?.length === 1 ? '' : 's'
            }.`
          : `Hotspot has no witnesses.`,
      infoTooltipText:
        'The number of witnesses for a Hotspot is based on a rolling 5-day window and resets when a Hotspot location or antenna is updated.',
      completed: witnesses?.length > 0,
    },
    {
      sortOrder: 5,
      title: 'Participate in a Challenge',
      detailText:
        activity.challengeeTxn !== null
          ? `Hotspot last participated in a challenge ${(
              height - activity.challengeeTxn.height
            ).toLocaleString()} block${
              height - activity.challengeeTxn.height === 1 ? '' : 's'
            } ago.`
          : `Hotspot hasn’t participated in a challenge yet. Hotspots are challenged every 480 blocks.`,
      infoTooltipText:
        'Participation in a challenge depends on having witnesses. Use the checkbox to see Hotspots in your list. It can take a few days for challenges to include this Hotspot once a witness list is built.',
      completed: activity.challengeeTxn !== null,
    },
    {
      sortOrder: 6,
      title: 'Transferred Data',
      detailText:
        activity.dataTransferTxn !== null
          ? // TODO: make this message more specific (e.g. add "x blocks ago") once the API has been updated to make that number easier to get
            `Hotspot has transferred data packets recently.`
          : `Hotspot hasn’t transfered data packets recently.`,
      infoTooltipText:
        'Hotspots transfer encrypted data on behalf of devices using the network. Device usage is expanding, and it is normal to have a Hotspot that does not transfer data. This likely means there are no devices using the network in the area.',
      completed: activity.dataTransferTxn !== null,
    },
  ]
}
