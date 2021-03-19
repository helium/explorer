import Link from 'next/link'
import AccountIcon from '../AccountIcon'

const AccountLink = ({ address }) => (
  <Link prefetch={false} href={`/accounts/${address}`}>
    <a className="text-gray-700 flex max-w-md content-center ml-2">
      <span className="mr-1 flex flex-row items-center justify-start">
        <AccountIcon address={address} />
      </span>
      <span style={{ marginTop: 1 }}>
        {[address.slice(0, 5), address.slice(-5)].join('...')}
      </span>
    </a>
  </Link>
)

export default AccountLink
