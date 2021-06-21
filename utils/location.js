import geoJSON from 'geojson'

export const findBounds = (arrayOfLatsAndLons) => {
  if (arrayOfLatsAndLons.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ]
  } else {
    let minLon = arrayOfLatsAndLons[0].lng
    let maxLon = arrayOfLatsAndLons[0].lng
    let minLat = arrayOfLatsAndLons[0].lat
    let maxLat = arrayOfLatsAndLons[0].lat

    arrayOfLatsAndLons.map((m) => {
      if (m.lng < minLon) minLon = m.lng
      if (m.lng > maxLon) maxLon = m.lng
      if (m.lat < minLat) minLat = m.lat
      if (m.lat > maxLat) maxLat = m.lat
    })

    const mapBounds = [
      [maxLon, maxLat],
      [minLon, minLat],
    ]

    return mapBounds
  }
}

export const paddingPoints = ({ lat, lng }, paddingDistance = 0.01) => [
  { lat: lat + paddingDistance, lng },
  { lat: lat - paddingDistance, lng },
]

export const emptyGeoJSON = geoJSON.parse([], {
  Point: ['lat', 'lng'],
})

export const haversineDistance = (lon1, lat1, lon2, lat2) => {
  function toRad(x) {
    return (x * Math.PI) / 180
  }

  var R = 6371

  var x1 = lat2 - lat1
  var dLat = toRad(x1)
  var x2 = lon2 - lon1
  var dLon = toRad(x2)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c

  return d
}
