import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import Widget from '../Widgets/Widget'
import FlagLocation from '../Common/FlagLocation'
import PillNavbar from '../Nav/PillNavbar'
import TabNavbar from '../Nav/TabNavbar'
import { useHotspotsStats } from '../../data/hotspots'
import I18n from '../../copy/I18n'

const HotspotsInfoBox = () => {
  const { hotspotsStats: stats } = useHotspotsStats()

  return (
    <InfoBox title={<I18n t="hotspots.title" />}>
      <div className="w-full bg-white z-10 rounded-t-xl">
        <PillNavbar />
        <TabNavbar />
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
        <TrendWidget title="Hotspots" series={stats?.count} />
        <StatWidget title="% Online" series={stats?.onlinePct} />
        <StatWidget title="Hotspot Owners" series={stats?.ownersCount} />
        <StatWidget title="Cities" series={stats?.citiesCount} />
        <StatWidget title="Countries" series={stats?.countriesCount} />
        <Widget
          title="Latest Hotspot"
          value="Rural Midnight Panda"
          subtitle={<FlagLocation geocode={geocode} />}
          span={2}
        />
        <div className="col-span-2 pb-1" />
      </div>
    </InfoBox>
  )
}

const geocode = {
  cityId: 'ZW5jaW5pdGFzY2FsaWZvcm5pYXVuaXRlZCBzdGF0ZXM',
  longCity: 'Encinitas',
  longCountry: 'United States',
  longState: 'California',
  longStreet: 'Blue Sky Drive',
  shortCity: 'Encinitas',
  shortCountry: 'US',
  shortState: 'CA',
  shortStreet: 'Blue Sky Dr',
}

export default HotspotsInfoBox
