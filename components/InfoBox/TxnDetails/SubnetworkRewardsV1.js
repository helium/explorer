import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { memo, useCallback, useMemo } from 'react'
import Widget from '../../Widgets/Widget'
import Balance, { CurrencyType } from '@helium/currency'
import { useParams } from 'react-router-dom'
import AccountIcon from '../../AccountIcon'
import AccountAddress from '../../AccountAddress'

const SubnetworkRewardsV1 = ({ txn, inline }) => {
  const { address } = useParams()

  const currencyType = useMemo(() => txn.token_type === undefined || txn.token_type === null
    ? CurrencyType.mobile
    : CurrencyType.fromTokenType(txn.token_type), [txn.token_type])

  const rewards = useMemo(() => {
    if (address) {
      return txn.rewards?.filter((subnetItem) => subnetItem.account === address)
    }
    return txn.rewards
  }, [address, txn.rewards])

  const Rewards = useCallback(() => rewards?.map((reward) => {
    const balance = new Balance(reward.amount.integerBalance, currencyType)
    return (
      <Widget
        title={'Subnetwork Reward'}
        value={balance.toString()}
        span={2}
        subtitle={
          <span className="flex flex-row items-center justify-start space-x-0.5">
            <AccountIcon address={reward.account} size={12} />
            <AccountAddress
              showSecondHalf
              mono
              tooltip={reward.account}
              address={reward.account}
              truncate={5}
            />
          </span>
        }
      />
    )
  }), [currencyType, rewards])

  return (
    <InfoBoxPaneContainer padding={!inline}>
      <Widget title={'Token Type'} value={currencyType.ticker} span={2} />
      <Rewards />
    </InfoBoxPaneContainer>
  )
}

export default memo(SubnetworkRewardsV1)
