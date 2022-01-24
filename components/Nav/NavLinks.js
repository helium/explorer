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
  const { searchFocused } = useSearchResults()

  return (
    <div
      className={classNames(className, 'duration-200 transition-all', {
        'opacity-0': searchFocused,
      })}
    >
      <NavLink
        href="/hotspots"
        title="Hotspots"
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
      <FeedbackBubble className="flex">
        <div className="bg-navy-400 hover:bg-navy-300 px-4 md:px-3 py-1.5 md:py-1 cursor-pointer rounded-lg mt-5 md:mt-0">
          <span className="text-sm text-white flex items-center">
            <FeedbackIcon className="w-5 h-5 md:h-4 md:w-4 text-white" />
          </span>
        </div>
      </FeedbackBubble>
      <ChangelogButton className="hidden xl:block xl:-mr-4" />
    </div>
  )
}

export default NavLinks
