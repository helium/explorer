export const shouldPrefetchDetails = (type) => {
  if (!type) return false
  return (
    type.startsWith('rewards') ||
    type.startsWith('subnetwork_rewards') ||
    type.startsWith('poc_receipts') ||
    type.startsWith('payment') ||
    type.startsWith('state_channel_close') ||
    type.startsWith('validator_heartbeat') ||
    type.startsWith('transfer_hotspot')
  )
}
