export const formattedAccountAddress = (address) => {
  // TODO add optional truncation amount
  return `${address.slice(0, 10)}...${address.slice(-10)}`
}
