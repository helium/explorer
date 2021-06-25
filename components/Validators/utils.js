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
  if (isRelay(listen_addrs)) return 'relay'
  return online
}
