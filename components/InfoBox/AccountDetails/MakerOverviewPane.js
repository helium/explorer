import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import QrWidget from '../../Widgets/QrWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import MakerAccountBalanceWidget from '../../Widgets/MakerAccountBalanceWidget'
import Widget from '../../Widgets/Widget'
import { useMaker } from '../../../data/makers'
import { useMarket } from '../../../data/market'
import Currency from '../../Common/Currency'
import BurnIcon from '../../Icons/BurnIcon'
import HotspotSimpleIcon from '../../Icons/HotspotSimple'
import LocationIcon from '../../Icons/Location'

const MakerOverviewPane = () => {
  const { address } = useParams()
  const { account } = useAccount(address)
  const { maker } = useMaker(address)
  const { market } = useMarket()

  return (
    <InfoBoxPaneContainer>
      <MakerAccountBalanceWidget account={account} />
      <QrWidget address={address} />
      <Widget
        title="HNT Burned"
        titleIcon={<BurnIcon className="text-orange-300 w-3 h-auto" />}
        isLoading={!maker || !market}
        value={maker?.burnedHNT?.toString(2, { showTicker: false })}
        subtitle={
          <Currency value={maker?.burnedHNT?.floatBalance * market?.price} />
        }
      />
      <Widget
        title="Onboards Remaining"
        isLoading={!maker}
        value={maker?.assertsRemaining.toLocaleString()}
        subtitle={<span className="text-xs">5M DC ($50) per onboard</span>}
        tooltip="The number of hotspots this Maker could afford to onboard given their current DC balance, assuming a cost of 5M DC ($50) for each hotspot: 4M DC ($40) to add it to the blockchain, and 1M DC ($10) to assert its location"
      />
      <Widget
        title="Hotspots Added"
        titleIcon={<HotspotSimpleIcon className="text-green-500 w-3 h-auto" />}
        isLoading={!maker}
        value={maker?.txns?.addGatewayTxns?.toLocaleString()}
        subtitle={<span className="text-xs">4M DC ($40) per add</span>}
      />
      <Widget
        title="Locations Asserted"
        titleIcon={<LocationIcon className="text-pink-500 w-3 h-auto" />}
        isLoading={!maker}
        value={maker?.txns?.assertLocationTxns?.toLocaleString()}
        subtitle={<span className="text-xs">1M DC ($10) per assert</span>}
      />
    </InfoBoxPaneContainer>
  )
}

export default MakerOverviewPane
