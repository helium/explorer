import classNames from 'classnames'
import { Link } from 'react-router-i18n'

const NavLink = ({ href, title, className, onClick }) => (
  <Link
    to={href}
    onClick={onClick}
    className={classNames(className, {
      'text-white font-medium text-base hover:text-gray-500 focus:text-gray-600': !className,
    })}
  >
    {title}
  </Link>
)

const NavLinks = ({ className, children, onNavLinkClick, navLinkClasses }) => {
  return (
    <div className={className}>
      <NavLink
        href="/hotspots"
        title="Hotspots"
        className={navLinkClasses}
        onClick={onNavLinkClick}
      />
      <NavLink
        href="/beacons"
        title="Beacons"
        className={navLinkClasses}
        onClick={onNavLinkClick}
      />
      <NavLink
        href="/blocks"
        title="Blocks"
        className={navLinkClasses}
        onClick={onNavLinkClick}
      />
      <NavLink
        href="/validators"
        title="Validators"
        className={navLinkClasses}
        onClick={onNavLinkClick}
      />
      <NavLink
        href="/market"
        title="Market"
        className={navLinkClasses}
        onClick={onNavLinkClick}
      />
      {children}
    </div>
  )
}

export default NavLinks
