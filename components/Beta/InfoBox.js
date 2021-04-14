import classNames from 'classnames'
import Image from 'next/image'
import animalHash from 'angry-purple-tiger'
import { last, first } from 'lodash'
import FlagLocation from '../Common/FlagLocation'
import PillNavbar from './PillNavbar'
import TabNavbar from './TabNavbar'
import TrendWidget from './TrendWidget'
import Widget from './Widget'
import { useHotspotRewards } from '../../data/rewards'
import RewardsTrendWidget from './RewardsTrendWidget'

const MainInfoBox = ({
  showInfoBox,
  toggleShowInfoBox,
  selectedHotspot,
  hotspotsStats,
}) => {
  if (selectedHotspot) {
    return (
      <InfoBox
        title={animalHash(selectedHotspot.address)}
        visible={showInfoBox}
        toggleVisible={toggleShowInfoBox}
      >
        <HotspotDetailsInfoBox hotspot={selectedHotspot} />
      </InfoBox>
    )
  }

  return (
    <InfoBox
      title="Hotspots"
      visible={showInfoBox}
      toggleVisible={toggleShowInfoBox}
    >
      <HotspotsInfoBox stats={hotspotsStats} />
    </InfoBox>
  )
}

const InfoBox = ({ title, visible = true, toggleVisible, children }) => {
  return (
    <div
      className={classNames(
        'fixed left-0 z-20 md:left-10 md:top-0 bottom-0 md:m-auto w-full md:w-120 h-3/5 transform-gpu transition-transform duration-200 ease-in-ou',
        {
          // 'translate-y-full': !visible,
        },
      )}
      style={{ transform: `translateY(${visible ? 0 : 120}%)` }}
    >
      <div className="absolute flex justify-between w-full -top-16 p-4 md:px-0">
        <span className="text-white text-3xl font-semibold">{title}</span>
        <div className="md:hidden" onClick={toggleVisible}>
          <Image src="/images/circle-arrow.svg" width={35} height={35} />
        </div>
      </div>
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-lg w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

const HotspotsInfoBox = ({ stats }) => (
  <>
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
  </>
)

const StatWidget = ({ title, series }) => {
  const value = last(series || [])?.value
  const initial = first(series || [])?.value

  const stringOpts =
    value <= 1 ? { style: 'percent', maximumFractionDigits: 3 } : undefined

  const valueString = value?.toLocaleString(undefined, stringOpts)

  if (value === initial) {
    return (
      <Widget
        title={title}
        value={valueString}
        subtitle={<span className="text-gray-550">No Change</span>}
      />
    )
  }

  const changeString = (value - initial).toLocaleString(undefined, stringOpts)

  return <Widget title={title} value={valueString} change={changeString} />
}

const HotspotDetailsInfoBox = ({ hotspot }) => {
  const { rewards } = useHotspotRewards(hotspot.address)
  console.log('rewards', rewards)

  return (
    <>
      <div className="w-full bg-white z-10 rounded-t-xl">
        <TabNavbar />
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
        <RewardsTrendWidget title="30 Day Earnings" series={rewards} />
        <Widget
          title="Reward Scaling"
          value="0.50"
          subtitle={<span className="text-gray-550">No Change</span>}
        />
        <Widget title="Sync Status" value="Synced" />
        <Widget title="7D Beacons" value="54" change="+2" />
        <Widget title="7D Avg Witnesses" value="6.3" change="+0.5%" />
        <div className="col-span-2 pb-1" />
      </div>
    </>
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

export default MainInfoBox
