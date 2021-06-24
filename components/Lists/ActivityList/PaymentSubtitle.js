import classNames from 'classnames'
import AccountAddress from '../../AccountAddress'
import AccountIcon from '../../AccountIcon'
import ChevronIcon from '../../Icons/Chevron'

const PaymentSubtitle = ({
  amount,
  addressIsPayer,
  otherPartyAddress,
  otherPartyString,
}) => {
  return (
    <div className="flex items-center justify-start">
      <span className="flex items-center space-x-2">
        <span className="flex items-center justify-start space-x-1">
          <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
          {amount}
        </span>
        <ChevronIcon
          className={classNames(
            'text-gray-600 rotate-90 transform h-3 w-auto',
            { 'rotate-90': addressIsPayer, '-rotate-90': !addressIsPayer },
          )}
        />
        <div className="flex items-center justify-end text-gray-600">
          {otherPartyAddress ? (
            <>
              <AccountIcon size={12} address={otherPartyAddress} />
              <span className="pl-1 ">
                <AccountAddress
                  showSecondHalf={false}
                  address={otherPartyAddress}
                  truncate={5}
                  mono
                />
              </span>
            </>
          ) : (
            otherPartyString
          )}
        </div>
      </span>
    </div>
  )
}

export default PaymentSubtitle
