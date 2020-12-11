import ReactMapboxGl, { Marker } from 'react-mapbox-gl'
import { findBounds } from '../components/Txns/utils'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
})

const styles = {
  consensusMember: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#ff6666',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #c94f4f',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

const ConsensusMapbox = ({ members }) => {
  const memberLocations = []
  members.map((m) => memberLocations.push({ lng: m?.lng, lat: m?.lat }))
  const mapBounds = findBounds(memberLocations)

  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      fitBounds={mapBounds}
      fitBoundsOptions={{
        padding: 50,
        animate: false,
      }}
      movingMethod="jumpTo"
    >
      {members?.map((m, idx) => {
        return (
          <Marker
            key={m.address}
            style={styles.consensusMember}
            anchor="center"
            coordinates={[m?.lng, m?.lat]}
          >
            <span style={{ color: 'white', fontSize: '10px' }}>{idx + 1}</span>
          </Marker>
        )
      })}
    </Mapbox>
  )
}
export default ConsensusMapbox
