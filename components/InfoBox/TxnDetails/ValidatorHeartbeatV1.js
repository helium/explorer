import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'
import { formatVersion } from '../../Validators/utils'

const ValidatorHeartbeatV1 = ({ txn, inline }) => (
  <InfoBoxPaneContainer padding={!inline}>
    <ValidatorWidget title="Validator" address={txn.address} />
    <Widget title={'Version'} value={formatVersion(txn.version)} span={2} />
    <Widget title={'Raw Version Text'} value={txn.version} span={2} />
    <Widget
      title={'Signature'}
      value={txn.signature}
      copyableValue={txn.signature}
      span={2}
    />
  </InfoBoxPaneContainer>
)

export default ValidatorHeartbeatV1
