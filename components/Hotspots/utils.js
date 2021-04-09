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

export const formatWitnessInvalidReason = (rawInvalidReason) => {
  switch (rawInvalidReason) {
    case 'witness_too_close': {
      return 'Witness too close'
    }
    case 'witness_rssi_too_high': {
      return 'Witness RSSI too high'
    }
    case 'witness_on_incorrect_channel': {
      return 'Witness on incorrect channel'
    }
    case 'witness_rssi_below_lower_bound': {
      return 'Witness RSSI below lower bound'
    }
    default: {
      return `${rawInvalidReason}`
    }
  }
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
    (value === 0 && previousValue === 0) || previousValue === 0
      ? // if both the period and the previous period rewards were 0, or the previous value is 0, set percent change to 0
        0
      : ((value - previousValue) / previousValue) * 100
  return percentChangeValue
}

export const generateRewardScaleColor = (rewardScale) => {
  if (rewardScale >= 0.75) {
    return '#32C48D'
  } else if (rewardScale >= 0.5) {
    return '#FCC945'
  } else if (rewardScale >= 0.25) {
    return '#FEA053'
  } else {
    return '#E86161'
  }
}

export const isRelay = (listen_addrs) => {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}
