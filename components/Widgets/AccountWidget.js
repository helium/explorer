import Widget from './Widget'
import AccountAddress from '../AccountAddress'
import AccountIcon from '../AccountIcon'

const AccountWidget = ({ title, subtitle, address }) => {
  if (!address) return null

  return (
    <Widget
      title={title}
      value={
        <div className="flex items-center justify-start">
          <AccountIcon address={address} />
          <span className="pl-1">
            <AccountAddress address={address} truncate={7} />
          </span>
        </div>
      }
      subtitle={subtitle}
      span={2}
      linkTo={`/accounts/${address}`}
      isLoading={!address}
    />
  )
}

export default AccountWidget
