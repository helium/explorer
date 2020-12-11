export const findMiddlePoint = (memberLocations) => {
  let minLng = memberLocations[0].lng
  let maxLng = memberLocations[0].lng
  let minLat = memberLocations[0].lat
  let maxLat = memberLocations[0].lat

  memberLocations.map((m) => {
    if (m.lng < minLng) minLng = m.lng
    if (m.lng > maxLng) maxLng = m.lng
    if (m.lat < minLat) minLat = m.lat
    if (m.lat > maxLat) maxLat = m.lat
  })

  const distanceBetweenLons = maxLng - minLng
  const distanceBetweenLats = maxLat - minLat

  const midPointLon = maxLng - distanceBetweenLons / 2
  const midPointLat = maxLat - distanceBetweenLats / 2

  const zoomLevel =
    distanceBetweenLons > 175
      ? 0
      : distanceBetweenLons > 100
      ? 1.5
      : distanceBetweenLons > 75
      ? 2
      : distanceBetweenLons > 60
      ? 2.5
      : 3

  return [midPointLon, midPointLat, zoomLevel]
}
