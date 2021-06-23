import { round } from 'lodash'

const LargeBalance = ({ value }) => {
  if (!value) return 0

  const BILLION = 1_000_000_000
  const MILLION = 1_000_000

  if (value >= BILLION) {
    return [round(value / BILLION, 3), 'B'].join('')
  }

  if (value >= MILLION) {
    return [round(value / MILLION, 3), 'M'].join('')
  }

  return round(value, 3)
}

export default LargeBalance
