import Widget from './Widget'
import AccountAddress from '../AccountAddress'
import AccountIcon from '../AccountIcon'

const AccountWidget = ({
  title,
  subtitle,
  address,
  span = 2,
  truncate = 7,
  showSecondHalf = true,
}) => {
  if (!address) return null

  return (
    <Widget
      title={title}
      value={
        <div className="flex items-center justify-start">
          <AccountIcon address={address} />
          <span className="pl-1">
            <AccountAddress
              address={address}
              truncate={truncate}
              showSecondHalf={showSecondHalf}
            />
          </span>
        </div>
      }
      subtitle={subtitle}
      span={span}
      linkTo={`/accounts/${address}`}
      isLoading={!address}
    />
  )
}

export default AccountWidget
