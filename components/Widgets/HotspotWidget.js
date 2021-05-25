import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import Widget from './Widget'
import Skeleton from '../Common/Skeleton'

const HotspotWidget = ({ title, hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return <Widget span={2} isLoading />

  return (
    <Widget
      title={title}
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      onClick={() => selectHotspot(hotspot.address)}
    />
  )
}

export default HotspotWidget
