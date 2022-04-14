import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import TitleWithIcon from '../InfoBox/Common/TitleWithIcon'
import Widget from './Widget'

const HotspotWidget = ({ title, titleIconPath, hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return <Widget span={2} isLoading />

  return (
    <Widget
      title={
        titleIconPath ? (
          <TitleWithIcon title={title} iconPath={titleIconPath} />
        ) : (
          title
        )
      }
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      linkTo={`/hotspots/${hotspot.address}`}
      onClick={() => selectHotspot(hotspot.address)}
    />
  )
}

export default HotspotWidget
