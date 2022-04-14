import AccountWidget from '../../Widgets/AccountWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const StateChannelOpenV1 = ({ txn, inline }) => {
  return (
    <InfoBoxPaneContainer padding={!inline}>
      <AccountWidget title="Owner" address={txn.owner} />
      <Widget title="OUI" value={txn.oui} />
      <Widget title="Nonce" value={txn.nonce} />
      <Widget title="ID" value={txn.id} span={2} />
      <Widget title="Expire within" value={`${txn.expireWithin} Blocks`} />
      <Widget title="Fee" value={txn.fee.toString(2)} />
      <Widget title="Amount" value={txn.amount.toString(2)} />
    </InfoBoxPaneContainer>
  )
}

export default StateChannelOpenV1
