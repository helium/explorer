import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import Widget from './Widget'

const HotspotWidget = ({ title, hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return null

  return (
    <Widget
      title={title}
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      onClick={() => selectHotspot(hotspot.address)}
      isLoading={!hotspot}
    />
  )
}

export default HotspotWidget
