import { Switch, Route } from 'react-router-dom'
import OverviewInfoBox from './OverviewInfoBox'
import HotspotsInfoBox from './HotspotsInfoBox'
import HotspotDetailsInfoBox from './HotspotDetailsInfoBox'
import ValidatorsInfoBox from './ValidatorsInfoBox'

const InfoBoxSwitch = () => {
  // Match locales with regular expression containing each locale separated by `|`
  const base = '/:locale(en|fr)?'

  return (
    <Switch>
      <Route path={`${base}/hotspots/:address([a-zA-Z0-9]{40,})`}>
        <HotspotDetailsInfoBox />
      </Route>
      <Route path={`${base}/hotspots`}>
        <HotspotsInfoBox />
      </Route>
      <Route path={`${base}/validators`}>
        <ValidatorsInfoBox />
      </Route>
      <Route path={base}>
        <OverviewInfoBox />
      </Route>
    </Switch>
  )
}

export default InfoBoxSwitch
