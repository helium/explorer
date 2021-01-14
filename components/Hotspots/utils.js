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

export const formatPercentChangeString = (percentChangeNumber) => {
  const percentChangeString =
    percentChangeNumber === 0
      ? // if there wasn't a percentage change (both value and previousValue are 0), don't show the indicator
        ``
      : `${
          percentChangeNumber > 0 ? '+' : ''
        }${percentChangeNumber?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`
  return percentChangeString
}

export const calculatePercentChange = (value, previousValue) => {
  const percentChangeValue =
    value === 0 && previousValue === 0
      ? // if both the period and the previous period rewards were 0, set percent change to 0
        0
      : ((value - previousValue) / previousValue) * 100
  return percentChangeValue
}
