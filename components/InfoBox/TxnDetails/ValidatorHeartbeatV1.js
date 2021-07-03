import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'

const ValidatorHeartbeatV1 = ({ txn }) => (
  <InfoBoxPaneContainer>
    <ValidatorWidget title="Validator" address={txn.address} />
    <Widget title={'Version'} value={txn.version} span={2} />
    <Widget
      title={'Signature'}
      value={txn.signature}
      copyableValue={txn.signature}
      span={2}
    />
  </InfoBoxPaneContainer>
)

export default ValidatorHeartbeatV1
