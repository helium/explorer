import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Index from './pages/Index'
import BlockView from './pages/BlockView'
import TxnView from './pages/TxnView'
import AccountView from './pages/AccountView'
import HotspotView from './pages/HotspotView'
import ErrorView from './pages/ErrorView'

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Index}></Route>
      <Route path="/blocks/:hash" component={BlockView}></Route>
      <Route path="/txns/:hash" component={TxnView}></Route>
      <Route path="/accounts/:address" component={AccountView}></Route>
      <Route path="/hotspots/:address" component={HotspotView}></Route>
      <Route path="/error" component={ErrorView}></Route>
    </Switch>
  )
}

export default Router
