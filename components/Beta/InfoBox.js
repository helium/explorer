import TabNavbar from './TabNavbar'
import TrendWidget from './TrendWidget'
import Widget from './Widget'

const InfoBox = () => {
  return (
    <div className="fixed left-0 md:left-10 md:top-0 bottom-0 md:m-auto w-full md:w-120 h-3/5">
      <div className="text-white text-3xl font-semibold p-4 md:px-0">
        Hotspots
      </div>
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-lg w-full h-full flex flex-col">
        <div className="w-full bg-white z-10 rounded-t-xl">
          <TabNavbar />
        </div>
        <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
          <TrendWidget title="Hotspots" value="32,597" change="+0.3%" />
          <Widget title="% Online" value="71.4%" change="+0.3%" />
          <Widget title="Hotspot Owners" value="28,510" change="+0.3%" />
          <Widget title="Cities" value="3,468" change="+18" />
          <Widget title="Countries" value="63" change="" />
          <Widget
            title="Latest Hotspot"
            value="63"
            subtitle={<span>hellow</span>}
            span={2}
          />
        </div>
      </div>
    </div>
  )
}

export default InfoBox
