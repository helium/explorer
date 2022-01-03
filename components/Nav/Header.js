import { Link } from 'react-router-i18n'
import SearchBar from '../SearchBar/SearchBar'
import MobileNavOverlay from './MobileNavOverlay'
import NavLinks from './NavLinks'
import classNames from 'classnames'
import useToggle from '../../utils/useToggle'
import Banner from '../Common/Banner/Banner'
import { useContext } from 'react'
import BannerContext from '../Common/Banner/BannerContext'
import useSearchResults from '../SearchBar/useSearchResults'
import NetworkToggle from '../Common/NetworkToggle'

const MenuButton = ({ className }) => {
  const [menuOpen, toggleMenu] = useToggle()

  return (
    <>
      <div
        className={classNames(
          className,
          'cursor-pointer xl:hidden block transition-all duration-200',
          {
            'opacity-100': !menuOpen,
            'opacity-0': menuOpen,
          },
        )}
        onClick={toggleMenu}
      >
        <img alt="Menu icon" src="/images/menu.svg" />
      </div>
      <MobileNavOverlay menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </>
  )
}

const Header = ({ fallbackLinks = false }) => {
  const { showBanner } = useContext(BannerContext)
  const { searchFocused } = useSearchResults()

  return (
    <>
      {showBanner && <Banner />}
      <header
        className={classNames(
          'fixed w-full z-30 flex items-center justify-between',
          {
            'pt-14 md:pt-10': showBanner,
            'p-4': !searchFocused,
            'px-2 py-4 md:px-4 md:py-4': searchFocused,
          },
        )}
      >
        {fallbackLinks ? (
          <a
            href="/"
            className={classNames('transition-all duration-200', {
              'hidden md:flex': searchFocused,
            })}
          >
            <img alt="Helium Logo" src="/images/logo-sm.svg" />
          </a>
        ) : (
          <Link
            to="/"
            className={classNames('transition-all duration-200', {
              'hidden md:flex': searchFocused,
            })}
          >
            <img alt="Helium Logo" src="/images/logo-sm.svg" />
          </Link>
        )}
        <NetworkToggle />
        <div
          className={classNames(
            'grid grid-flow-col gap-8 items-center transition-all duration-200',
            {
              'w-full md:w-auto': searchFocused,
            },
          )}
        >
          <NavLinks
            className="hidden xl:grid grid-flow-col gap-4 w-full"
            fallbackLinks={fallbackLinks}
          />
          <div className="grid grid-flow-col gap-4 items-center">
            <SearchBar />
            <MenuButton
              className={classNames('', {
                hidden: searchFocused,
              })}
            />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
