export const findBounds = (arrayOfLatsAndLons) => {
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
