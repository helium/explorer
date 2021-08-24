import capitalize from 'lodash/capitalize'
import camelcaseKeys from 'camelcase-keys'
import { h3ToGeo, h3ToParent } from 'h3-js'
import { addDays, addHours, format, parseISO } from 'date-fns'

export const SYNC_BUFFER_BLOCKS = 1500

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

export const formatCountryLocation = (geocode0, shortened = false) => {
  const geocode = camelcaseKeys(geocode0)

  if (!geocode?.shortCountry && !geocode?.longCountry) {
    return 'No location set'
  }

  const locationTerms = []

  locationTerms.push(shortened ? geocode?.shortCountry : geocode?.longCountry)

  return locationTerms.join(', ')
}

export const formatLocation = (geocode0, shortened = false) => {
  const geocode = camelcaseKeys(geocode0)

  if (!geocode?.longCity && !geocode?.shortState && !geocode?.longCountry) {
    return 'No location set'
  }

  const locationTerms = []

  if (geocode?.longCity) {
    locationTerms.push(geocode?.longCity)
  }

  if (!shortened && geocode?.shortState) {
    locationTerms.push(geocode?.shortState)
  }

  locationTerms.push(shortened ? geocode?.shortCountry : geocode?.longCountry)

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
  const factor = 1 / 6

  if (rewardScale >= factor * 5) {
    return '#29D344'
  } else if (rewardScale >= factor * 4) {
    return '#9FE14A'
  } else if (rewardScale >= factor * 3) {
    return '#FCC945'
  } else if (rewardScale >= factor * 2) {
    return '#FEA053'
  } else if (rewardScale >= factor * 1) {
    return '#FC8745'
  } else {
    return '#FF6666'
  }
}

export const witnessRssi = (histogram = {}) =>
  Object.keys(histogram).reduce(
    (a, b) => (histogram[a] > histogram[b] ? a : b),
    0,
  )

export const hotspotToRes8 = (hotspot) => {
  const res8Location =
    hotspot.locationHex ||
    hotspot.location_hex ||
    h3ToParent(hotspot.location, 8)
  const [res8Lat, res8Lng] = h3ToGeo(res8Location)

  return {
    ...hotspot,
    location: res8Location,
    lat: res8Lat,
    lng: res8Lng,
  }
}

export const isRelay = (listenAddrs) => {
  const IP = /ip4/g

  return !!(
    listenAddrs &&
    listenAddrs.length > 0 &&
    !listenAddrs.find((a) => a.match(IP))
  )
}

export const formatGain = (gain) => {
  return `${gain / 10} dBi`
}

export const formatElevation = (elevation) => {
  return `${elevation} m`
}

export const isDataOnly = (hotspot) => {
  return hotspot?.mode === 'dataonly'
}

export const formatHoursRange = (timestamp) => {
  // API returns previous hour as the timestamp, so add 1 hour to show "[1 hour ago] – [now]" and make the range clear
  return `${format(parseISO(timestamp), 'h:mm a')} – ${format(
    addHours(parseISO(timestamp), 1),
    'h:mm a',
  )}`
}

export const formatDaysRange = (timestamp) => {
  // API returns previous day as the timestamp for previous 24 hours, so add 1 day to show "[yesterday] – [today]" and make the range clear
  return `${format(parseISO(timestamp), 'MMM d')} – ${format(
    addDays(parseISO(timestamp), 1),
    'MMM do, y',
  )}`
}
