import capitalize from 'lodash/capitalize'

export const formatHotspotName = (dashedName) =>
  dashedName.split('-').map(capitalize).join(' ')

export const formatDistance = (meters) => {
  if (meters < 1000) {
    return meters.toLocaleString() + ' m'
  }

  if (meters < 10000) {
    return (
      (meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) +
      ' km'
    )
  }

  return (
    (meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) +
    ' km'
  )
}

export const formatLocation = (geocode) => {
  if (!geocode?.longCity && !geocode?.shortState && !geocode?.longCountry) {
    return 'No location set'
  }

  const locationTerms = [geocode?.longCity]

  if (geocode?.shortState !== null && geocode?.shortState !== undefined) {
    locationTerms.push(geocode?.shortState)
  }

  locationTerms.push(geocode?.longCountry)

  return locationTerms.join(', ')
}
