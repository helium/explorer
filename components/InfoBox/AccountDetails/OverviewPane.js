import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import QrWidget from '../../Widgets/QrWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import AccountTokenList from '../../Accounts/AccountTokenList'

const OverviewPane = () => {
  const { address } = useParams()
  const { account } = useAccount(address)

  return (
    <InfoBoxPaneContainer>
      <QrWidget address={address} />
      <AccountTokenList account={account} />
      <Widget
        title="Hotspots"
        isLoading={!account}
        value={maybeShowNone(account?.hotspotCount)}
        linkTo={`/accounts/${address}/hotspots`}
      />
      <Widget
        title="Validators"
        isLoading={!account}
        value={maybeShowNone(account?.validatorCount)}
        linkTo={`/accounts/${address}/validators`}
      />
    </InfoBoxPaneContainer>
  )
}

const maybeShowNone = (value) => {
  if (value === 0) return <NoneValue />
  return value?.toLocaleString()
}

const NoneValue = () => {
  return <span className="text-3xl text-gray-500">None</span>
}

export default OverviewPane
