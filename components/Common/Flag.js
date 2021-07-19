import ReactCountryFlag from 'react-country-flag'
import classNames from 'classnames'

const Flag = ({ className, countryCode }) => {
  if (!countryCode) return null
  return (
    <span
      className={classNames(
        'w-4 flex flex-row items-center justify-start',
        className,
      )}
    >
      <ReactCountryFlag countryCode={countryCode} svg />
    </span>
  )
}

export default Flag
