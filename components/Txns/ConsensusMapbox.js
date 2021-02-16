import ReactMapboxGl, { Marker, ZoomControl } from 'react-mapbox-gl'
import { findBounds } from './utils'
import animalHash from 'angry-purple-tiger'
import { Tooltip, Button } from 'antd'
import ReactCountryFlag from 'react-country-flag'
import { useRouter } from 'next/router'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useState } from 'react'
import { ReloadOutlined } from '@ant-design/icons'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  scrollZoom: false,
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
  const router = useRouter()

  const [mapBounds, setMapBounds] = useState(
    findBounds(members.map((m) => ({ lng: m?.lng, lat: m?.lat }))),
  )

  const calculateBounds = () => {
    const memberLocations = []
    members.map((m) => memberLocations.push({ lng: m?.lng, lat: m?.lat }))
    setMapBounds(findBounds(memberLocations))
  }

  useDeepCompareEffect(() => {
    // only recalculate bounds if the consensus group changes (requires looking deeply at–i.e. comparing each item in—the dependency array)
    // otherwise (with a regular useEffect()) this would recalculate every time the data refreshes, resetting the user's zoom and pan every 10 seconds
    calculateBounds()
  }, [members])

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
        padding: 100,
        animate: false,
      }}
      movingMethod="jumpTo"
    >
      <ZoomControl />
      {members?.map((m, idx) => {
        return (
          <Tooltip
            title={
              <>
                {animalHash(m.address)}{' '}
                <ReactCountryFlag
                  countryCode={m.geocode.short_country}
                  style={{
                    fontSize: '1.5em',
                    marginLeft: '0 4px',
                    lineHeight: '1.5em',
                  }}
                />
              </>
            }
          >
            <Marker
              key={m.address}
              style={styles.consensusMember}
              anchor="center"
              coordinates={[m?.lng, m?.lat]}
              onClick={() => router.push(`/hotspots/${m.address}`)}
            >
              <span style={{ color: 'white', fontSize: '10px' }}>
                {idx + 1}
              </span>
            </Marker>
          </Tooltip>
        )
      })}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          right: '12px',
        }}
      >
        <Tooltip title={`Reset zoom and pan`} placement={'bottomRight'}>
          <Button
            type="secondary"
            shape="circle"
            size={'small'}
            onClick={() => calculateBounds()}
            icon={<ReloadOutlined />}
          ></Button>
        </Tooltip>
      </div>
    </Mapbox>
  )
}
export default ConsensusMapbox
