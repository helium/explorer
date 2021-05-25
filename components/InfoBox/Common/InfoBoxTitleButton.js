import classNames from 'classnames'
import { Link } from 'react-router-i18n'

const InfoBoxTitleButton = ({ linkPath, icon, classes }) => (
  <Link
    className={classNames(
      'bg-gray-800 shadow-md hover:bg-gray-650 transition-all duration-150 rounded-md h-7 w-7 flex items-center justify-center',
      classes,
    )}
    to={linkPath}
  >
    {icon}
  </Link>
)

export default InfoBoxTitleButton
