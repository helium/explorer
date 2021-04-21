import ReactMapboxGl, { Marker } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({})

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
      style="https://api.maptiler.com/maps/2469a8ae-f7e5-4ed1-b856-cd312538e33b/style.json?key=kNomjOqCRi7kEjO4HbFF"
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
