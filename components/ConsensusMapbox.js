import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
})

const styles = {
  consensusMember: {
    width: 14,
    height: 14,
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
  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      center={[0, 0]}
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      zoom={[11]}
      movingMethod="jumpTo"
    >
      {members.map((m, idx) => {
        return (
          <Marker
            key={m.address}
            style={styles.consensusMember}
            anchor="center"
            coordinates={[m.lat ? m.lat : 0, m.lon ? m.lon : 0]}
          >
            <span style={{ color: 'white', fontSize: '8px' }}>{idx + 1}</span>
          </Marker>
        )
      })}
    </Mapbox>
  )
}
export default ConsensusMapbox
