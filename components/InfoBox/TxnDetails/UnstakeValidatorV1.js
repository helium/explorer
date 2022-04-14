import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'
import CountdownWidget from '../../Widgets/CountdownWidget'
import { useBlockHeight } from '../../../data/blocks'

const UnstakeValidatorV1 = ({ txn, inline }) => {
  const { height: currentHeight } = useBlockHeight()
  return (
    <InfoBoxPaneContainer padding={!inline}>
      <ValidatorWidget title="Validator" address={txn.address} />
      <AccountWidget title="Owner" address={txn.owner} />
      <Widget title={'Stake Amount'} value={txn.stakeAmount.toString(2)} />
      <Widget title={'Fee'} value={txn.fee.toString()} />
      <Widget
        title={'Stake Release Height'}
        value={txn.stakeReleaseHeight.toLocaleString()}
        longSubtitle
      />
      <Widget
        title={'Current Block Height'}
        isLoading={!currentHeight}
        value={currentHeight?.toLocaleString()}
      />
      <CountdownWidget
        title="Approximate Time Until Stake Release"
        completedText="Stake Released"
        isLoading={!currentHeight}
        blocksRemaining={txn.stakeReleaseHeight - currentHeight}
        subtitle={
          <span className="text-xs">
            Remaining Blocks:{' '}
            {currentHeight && txn.stakeReleaseHeight - currentHeight > 0
              ? (txn.stakeReleaseHeight - currentHeight)?.toLocaleString()
              : '0'}
          </span>
        }
      />
      <Widget
        title={'Owner Signature'}
        value={txn.ownerSignature}
        copyableValue={txn.ownerSignature}
        span={2}
      />
    </InfoBoxPaneContainer>
  )
}

export default UnstakeValidatorV1
