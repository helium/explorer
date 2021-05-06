import client from './client'

export const fetchAccount = async (address) => {
  return client.accounts.get(address)
}
