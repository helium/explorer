import ReactMapboxGl, { Marker } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
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
  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      center={[-95.712891, 37.09024]}
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      zoom={[3]}
      movingMethod="jumpTo"
    >
      {txn.stateChannel.summaries.forEach((s) => {
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
