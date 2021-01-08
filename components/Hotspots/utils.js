import capitalize from 'lodash/capitalize'
import camelcaseKeys from 'camelcase-keys'

export const formatHotspotName = (dashedName) =>
  dashedName.split('-').map(capitalize).join(' ')

export const formatDistance = (meters) => {
  if (meters < 1000) {
    return meters.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' m'
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

export const formatLocation = (geocode0) => {
  const geocode = camelcaseKeys(geocode0)

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
