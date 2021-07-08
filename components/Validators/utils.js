export const isRelay = (listen_addrs) => {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}

export const statusCircleColor = {
  relay: 'yellow',
  online: 'green',
  offline: 'gray',
}

export const getStatus = (online, listen_addrs) => {
  if (online === null) return 'offline'
  if (isRelay(listen_addrs)) return 'relay'
  return online
}

export const formatVersion = (versionHeartbeat) => {
  if (!versionHeartbeat) return

  const versionString = versionHeartbeat.toString().padStart(10, '0')
  const major = parseInt(versionString.slice(0, 3))
  const minor = parseInt(versionString.slice(3, 6))
  const patch = parseInt(versionString.slice(6, 10))

  return [major, minor, patch].join('.')
}

export const filterEligibleValidators = (v) =>
  v.stakeStatus === 'staked' && v?.status?.online === 'online'
