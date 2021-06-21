import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import Widget from './Widget'

const TitleWithIcon = ({ title, iconPath }) => (
  <span className="flex items-center justify-start">
    <img alt="" src={iconPath} className="h-4 w-auto mr-1" />
    {title}
  </span>
)

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
