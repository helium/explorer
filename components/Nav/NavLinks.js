import classNames from 'classnames'
import { Link } from 'react-router-i18n'

const NavLinks = ({ className, children, onNavLinkClick, navLinkClasses }) => {
  const NavLink = ({ href, title }) => (
    <Link
      to={href}
      onClick={onNavLinkClick}
      className={classNames(navLinkClasses, {
        'text-white font-medium text-base': !navLinkClasses,
      })}
    >
      {title}
    </Link>
  )
  return (
    <div className={className}>
      <NavLink href="/hotspots" title="Hotspots" />
      <NavLink href="/beacons" title="Beacons" />
      <NavLink href="/blocks" title="Blocks" />
      <NavLink href="/validators" title="Validators" />
      <NavLink href="/market" title="Market" />
      {children}
    </div>
  )
}

export default NavLinks
