export const shouldPrefetchDetails = (type) => {
  return (
    type.startsWith('rewards') ||
    type.startsWith('poc_receipts') ||
    type.startsWith('payment') ||
    type.startsWith('state_channel_close') ||
    type.startsWith('validator_heartbeat')
  )
}
