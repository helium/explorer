import { round } from 'lodash'

export const formatLargeNumber = (number) => {
  const BILLION = 1_000_000_000
  const MILLION = 1_000_000

  if (number >= BILLION) {
    return [round(number / BILLION, 3), 'B'].join('')
  }

  return [round(number / MILLION, 3), 'M'].join('')
}

export const formatPercent = (number, digits = 2) =>
  number.toLocaleString(undefined, {
    style: 'percent',
    maximumFractionDigits: digits,
  })
