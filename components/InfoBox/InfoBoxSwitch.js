import { Switch, Route } from 'react-router-dom'
import OverviewInfoBox from './OverviewInfoBox'
import HotspotsInfoBox from './HotspotsInfoBox'
import HotspotDetailsInfoBox from './HotspotDetailsInfoBox'
import ValidatorsInfoBox from './ValidatorsInfoBox'
import BlocksInfoBox from './BlocksInfoBox'
import BlockDetailsInfoBox from './BlockDetailsInfoBox'
import BeaconsInfoBox from './BeaconsInfoBox'
import TxnDetailsInfoBox from './TxnDetailsInfoBox'
import AccountsInfoBox from './AccountsInfoBox'
import AccountDetailsInfoBox from './AccountDetailsInfoBox'
import ValidatorDetailsInfoBox from './ValidatorDetailsInfoBox'
import HexDetailsInfoBox from './HexDetailsInfoBox'
import MarketInfoBox from './MarketInfoBox'
import CommunityToolsInfoBox from './CommunityTools/CommunityToolsInfoBox'
import ErrorInfoBox from './ErrorInfoBox'

const InfoBoxSwitch = () => {
  // Match locales with regular expression containing each locale separated by `|`
  const base = '/:locale(en|fr)?'

  return (
    <Switch>
      <Route path={`${base}/hotspots/hex/:index([a-z0-9]{15})`}>
        <HexDetailsInfoBox />
      </Route>
      <Route path={`${base}/hotspots/:address([a-zA-Z0-9]{40,})`}>
        <HotspotDetailsInfoBox />
      </Route>
      <Route path={`${base}/hotspots`}>
        <HotspotsInfoBox />
      </Route>
      <Route path={`${base}/accounts/:address([a-zA-Z0-9]{40,})`}>
        <AccountDetailsInfoBox />
      </Route>
      <Route path={`${base}/accounts`}>
        <AccountsInfoBox />
      </Route>
      <Route path={`${base}/validators/:address([a-zA-Z0-9]{40,})`}>
        <ValidatorDetailsInfoBox />
      </Route>
      <Route path={`${base}/validators`}>
        <ValidatorsInfoBox />
      </Route>
      <Route path={`${base}/blocks/:block(\\d+)`}>
        <BlockDetailsInfoBox />
      </Route>
      <Route path={`${base}/txns/:hash`}>
        <TxnDetailsInfoBox />
      </Route>
      <Route path={`${base}/blocks`}>
        <BlocksInfoBox />
      </Route>
      <Route path={`${base}/beacons`}>
        <BeaconsInfoBox />
      </Route>
      <Route path={`${base}/market`}>
        <MarketInfoBox />
      </Route>
      <Route path={`${base}/tools`}>
        <CommunityToolsInfoBox />
      </Route>
      <Route exact path={base}>
        <OverviewInfoBox />
      </Route>
      <Route exact path={`${base}/coverage`}>
        <OverviewInfoBox />
      </Route>
      <Route>
        <ErrorInfoBox />
      </Route>
    </Switch>
  )
}

export default InfoBoxSwitch
