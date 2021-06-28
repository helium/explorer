import { round } from 'lodash'

const LargeBalance = ({ value, precision = 3 }) => {
  const BILLION = 1_000_000_000
  const MILLION = 1_000_000
  const THOUSAND = 1_000

  let formattedValue

  if (value >= BILLION) {
    formattedValue = [round(value / BILLION, precision), 'B'].join('')
  } else if (value >= MILLION) {
    formattedValue = [round(value / MILLION, precision), 'M'].join('')
  } else if (value >= THOUSAND) {
    formattedValue = [round(value / THOUSAND, precision), 'K'].join('')
  } else {
    formattedValue = round(value, precision).toLocaleString()
  }

  return <span>{formattedValue}</span>
}

export default LargeBalance
