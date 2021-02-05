import ReactMapboxGl, { Marker } from 'react-mapbox-gl'
import { findBounds } from './utils'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
})

const styles = {
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#1B8DFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  transmittingMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#A984FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #8B62EA',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

const HotspotMapbox = ({ hotspots, txn }) => {
  const hotspotLocations = []
  txn.stateChannel.summaries.map((s) => {
    const hotspot = hotspots.find((e) => e.address === s.client)
    if (hotspot && hotspot.lng && hotspot.lat) {
      return hotspotLocations.push({ lng: hotspot.lng, lat: hotspot.lat })
    }
  })
  const mapBounds = findBounds(hotspotLocations)

  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      fitBounds={mapBounds}
      fitBoundsOptions={{
        padding: 100,
        animate: false,
      }}
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      movingMethod="jumpTo"
    >
      {txn.stateChannel.summaries.map((s) => {
        const hotspot = hotspots.find((e) => e.address === s.client)
        if (hotspot && hotspot.lng && hotspot.lat) {
          return (
            // TODO: see if there's a better way to do this than pulling all hotspots
            <Marker
              key={hotspot.address}
              style={styles.gatewayMarker}
              anchor="center"
              coordinates={[hotspot.lng, hotspot.lat]}
            />
          )
        }
      })}
    </Mapbox>
  )
}
export default HotspotMapbox
