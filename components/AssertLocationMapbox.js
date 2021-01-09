import ReactMapboxGl, { Marker } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
})

const styles = {
  assertedHotspotLocation: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: '#16CEE8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #15b8cf',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

const AssertLocationMapbox = ({ txn }) => {
  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      center={[txn?.lng, txn?.lat]}
      zoom={[10]}
      movingMethod="jumpTo"
    >
      <Marker
        key={txn.gateway}
        style={styles.assertedHotspotLocation}
        anchor="center"
        coordinates={[txn?.lng, txn?.lat]}
      ></Marker>
    </Mapbox>
  )
}
export default AssertLocationMapbox
