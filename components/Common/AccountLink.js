import Link from 'next/link'
import AccountIcon from '../AccountIcon'

const AccountLink = ({ address }) => (
  <Link prefetch={false} href={`/accounts/${address}`}>
    <a className="text-gray-400 flex max-w-md content-center ml-2">
      <span className="mr-1">
        <AccountIcon address={address} />
      </span>
      <span className="mt-0.5">
        {[address.slice(0, 5), address.slice(-5)].join('...')}
      </span>
    </a>
  </Link>
)

export default AccountLink
