import Link from 'next/link'
import AccountIcon from '../AccountIcon'

const AccountLink = ({ address }) => (
  <Link prefetch={false} href={`/accounts/${address}`}>
    <a className="text-gray-400 flex">
      <span className="mr-1">
        <AccountIcon address={address} />
      </span>
      {[address.slice(0, 5), address.slice(-5)].join('...')}
    </a>
  </Link>
)

export default AccountLink
