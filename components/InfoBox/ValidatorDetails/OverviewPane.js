import { Tooltip } from 'antd'
import { truncate, upperCase, upperFirst } from 'lodash'
import { useParams } from 'react-router'
import { useBlockHeight } from '../../../data/blocks'
import { useValidator } from '../../../data/validators'
import ValidatorStatusDot from '../../Validators/ValidatorStatusDot'
import PenaltyWidget from '../../Widgets/PenaltyWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { formatVersion, getStatus } from '../../Validators/utils'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import RelayedWarningWidget from '../../Widgets/WarningWidget'
import { isRelay } from '../../Hotspots/utils'

const OverviewPane = () => {
  const { address } = useParams()
  const { validator, isLoading } = useValidator(address)
  const { height, isLoading: blockHeightLoading } = useBlockHeight()

  return (
    <InfoBoxPaneContainer>
      {!isLoading && (
        <RelayedWarningWidget
          isVisible={isRelay(validator.status.listenAddrs)}
          warningText={'Validator is being Relayed.'}
          link={
            'https://docs.helium.com/mine-hnt/validators/mainnet/deployment-guide'
          }
          linkText={'Learn more'}
        />
      )}
      <Widget
        title={'Status'}
        isLoading={isLoading}
        value={
          <div className="flex items-center space-x-1.5">
            <ValidatorStatusDot includeStatusText status={validator?.status} />
            <span>
              {upperFirst(
                getStatus(
                  validator?.status?.online,
                  validator?.status?.listen_addrs,
                ),
              )}
            </span>
          </div>
        }
      />
      <Widget
        title="Last Heartbeat"
        isLoading={isLoading || blockHeightLoading}
        value={(height - validator?.lastHeartbeat).toLocaleString()}
        subtitle={<span className="text-gray-600">blocks ago</span>}
      />
      <Widget
        title="Total HNT Stake"
        isLoading={isLoading}
        value={maybeShowNone(
          validator?.stake?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="Version"
        isLoading={isLoading}
        value={formatVersion(validator?.versionHeartbeat)}
      />
      <PeriodizedRewardsWidget
        address={validator?.address}
        type="validator"
        title="Earnings"
      />
      <PenaltyWidget validator={validator} />
      {/* <Widget
        title="ISP"
        isLoading={isLoading}
        span={2}
        value={<ISP validator={validator} />}
      /> */}
    </InfoBoxPaneContainer>
  )
}

const maybeShowNone = (value) => {
  if (value === '0') return <NoneValue />
  return value
}

const NoneValue = () => {
  return <span className="text-3xl text-gray-500">None</span>
}

const ISP = ({ validator }) => {
  const isp = validator?.geo?.isp
  if (!isp) return <NoneValue />
  return (
    <Tooltip title={isp}>
      <span className="break-words">{formatISP(isp)}</span>
    </Tooltip>
  )
}

const formatISP = (isp) => {
  if (isp.match(/-/)) {
    return upperCase(isp.split('-')[0])
  }
  if (isp.length < 24 && isp.match(/,/)) {
    return upperCase(isp.split(',')[0])
  }
  return upperCase(
    truncate(isp, {
      length: 18,
      separator: ' ',
    }),
  )
}

export default OverviewPane
