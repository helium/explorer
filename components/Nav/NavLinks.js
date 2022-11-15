import classNames from 'classnames'
import { Link } from 'react-router-i18n'
import ChangelogButton from '../Common/Changelog/ChangelogButton'
import FeedbackBubble from '../FeedbackBubble'
import FeedbackIcon from '../Icons/Feedback'
import useSearchResults from '../SearchBar/useSearchResults'

const NavLink = ({ href, title, className, onClick, fallback }) =>
  fallback ? (
    <a
      href={href}
      onClick={onClick}
      className={classNames(className, {
        'flex items-center justify-center font-sans text-sm text-white hover:text-gray-500 focus:text-gray-600':
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
        'flex items-center justify-center font-sans text-sm text-white hover:text-gray-500 focus:text-gray-600':
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
  const { searchFocused } = useSearchResults()

  return (
    <div
      className={classNames(className, 'transition-all duration-200', {
        'opacity-0': searchFocused,
      })}
    >
      <NavLink
        href="/iot"
        title="IOT"
        className={navLinkClasses}
        onClick={onNavLinkClick}
        fallback={fallbackLinks}
      />
      <NavLink
        href="/mobile"
        title="MOBILE"
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
      <FeedbackBubble className="flex">
        <div className="mt-5 cursor-pointer rounded-lg bg-navy-400 px-4 py-1.5 hover:bg-navy-300 md:mt-0 md:px-3 md:py-1">
          <span className="flex items-center text-sm text-white">
            <FeedbackIcon className="h-5 w-5 text-white md:h-4 md:w-4" />
          </span>
        </div>
      </FeedbackBubble>
      <ChangelogButton className="hidden xl:-mr-4 xl:block" />
    </div>
  )
}

export default NavLinks
