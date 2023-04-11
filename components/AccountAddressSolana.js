import React from 'react'
import { isInteger } from 'lodash'
import classNames from 'classnames'
import Skeleton from './Common/Skeleton'
import Address from '@helium/address'
import { PublicKey } from '@solana/web3.js'

const AccountAddress = ({
  address,
  soladdr,
  truncate = false,
  mono,
  showSecondHalf = true,
  classes,
}) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  if (!address) return <Skeleton />

  address = Address.fromB58(address)
  soladdr = new PublicKey(address.publicKey).toBase58()
  return (
    <span
      className={classNames('cursor-pointer break-all', classes, {
        'font-mono': mono,
      })}
    >
      {truncate ? (
        <span>
          {soladdr.slice(0, truncateAmount)}
          <span className="px-0.5 tracking-wide text-gray-525">...</span>
          {showSecondHalf && <span>{soladdr.slice(-truncateAmount)}</span>}
        </span>
      ) : (
        soladdr
      )}
    </span>
  )
}

export default AccountAddress
