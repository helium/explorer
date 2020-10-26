import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'

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
  witnessMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#F1C40F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #B7950B',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
    opacity: 0.3,
  },
}

const HotspotMapbox = ({ hotspot, witnesses, showWitnesses }) => {
  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      center={[hotspot.lng ? hotspot.lng : 0, hotspot.lat ? hotspot.lat : 0]}
      containerStyle={{
        width: '100%',
      }}
      zoom={[11]}
      movingMethod="jumpTo"
    >
      <Marker
        key={hotspot.address}
        style={styles.gatewayMarker}
        anchor="center"
        symbol="yolo"
        coordinates={[
          hotspot.lng ? hotspot.lng : 0,
          hotspot.lat ? hotspot.lat : 0,
        ]}
      />

      {showWitnesses &&
        witnesses.map((w) => {
          return (
            <span>
              <Marker
                key={w.address}
                style={styles.witnessMarker}
                anchor="center"
                coordinates={[w.lng, w.lat]}
              ></Marker>
              <Layer
                key={'line-' + w.address}
                type="line"
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round',
                }}
                paint={{
                  'line-color': '#F1C40F',
                  'line-width': 2,
                  'line-opacity': 0.3,
                }}
              >
                <Feature
                  coordinates={[
                    [w.lng, w.lat],
                    [hotspot.lng, hotspot.lat],
                  ]}
                />
              </Layer>
            </span>
          )
        })}
    </Mapbox>
  )
}
export default HotspotMapbox
