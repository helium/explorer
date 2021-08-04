import classNames from 'classnames'
import { Link } from 'react-router-i18n'
import FeedbackBubble from '../FeedbackBubble'
import FeedbackIcon from '../Icons/Feedback'

const NavLink = ({ href, title, className, onClick, fallback }) =>
  fallback ? (
    <a
      href={href}
      onClick={onClick}
      className={classNames(className, {
        'text-white font-sans flex items-center justify-center text-sm hover:text-gray-500 focus:text-gray-600':
          !className,
      })}
    >
      {title}
    </a>
  ) : (
    <Link
      to={href}
      onClick={onClick}
      className={classNames(className, {
        'text-white font-sans flex items-center justify-center text-sm hover:text-gray-500 focus:text-gray-600':
          !className,
      })}
    >
      {title}
    </Link>
  )

const NavLinks = ({
  className,
  onNavLinkClick,
  navLinkClasses,
  fallbackLinks = false,
}) => {
  return (
    <div className={className}>
      <NavLink
        href="/hotspots"
        title="Hotspots"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/beacons"
        title="Beacons"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/blocks"
        title="Blocks"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/validators"
        title="Validators"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/market"
        title="Market"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/tools"
        title="Tools"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <FeedbackBubble className="flex xl:-mr-4">
        <div className="bg-navy-400 hover:bg-navy-300 px-3 py-1 cursor-pointer rounded-lg">
          <span className="text-sm text-white flex items-center">
            <FeedbackIcon className="h-4 w-4 text-white" />
          </span>
        </div>
      </FeedbackBubble>
    </div>
  )
}

export default NavLinks
