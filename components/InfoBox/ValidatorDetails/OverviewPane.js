import { Tooltip } from 'antd'
import { truncate, upperCase } from 'lodash'
import { useParams } from 'react-router'
import { useBlockHeight } from '../../../data/blocks'
import { useValidator } from '../../../data/validators'
import TrendWidget from '../../Widgets/TrendWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const OverviewPane = () => {
  const { address } = useParams()
  const { validator, isLoading } = useValidator(address)
  const { height, isLoading: blockHeightLoading } = useBlockHeight()

  return (
    <InfoBoxPaneContainer>
      <TrendWidget title="30D Earnings" periodLabel={''} series={[]} />
      <Widget
        title="Total HNT Stake"
        isLoading={isLoading}
        value={maybeShowNone(
          validator?.stake?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="Last Heartbeat"
        isLoading={isLoading || blockHeightLoading}
        value={(height - validator?.lastHeartbeat).toLocaleString()}
      />
      <Widget
        title="ISP"
        isLoading={isLoading}
        value={<ISP validator={validator} />}
      />
      <Widget
        title="Version"
        isLoading={isLoading}
        value={validator?.versionHeartbeat}
      />
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
