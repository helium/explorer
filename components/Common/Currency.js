import { round } from 'lodash'

const Currency = ({ value, isLarge = false }) => {
  if (!value) return 0

  if (isLarge) {
    const BILLION = 1_000_000_000
    const MILLION = 1_000_000

    if (value >= BILLION) {
      return ['$', round(value / BILLION, 3), 'B'].join('')
    }

    return ['$', round(value / MILLION, 3), 'M'].join('')
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export default Currency
