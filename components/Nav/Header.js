import { useState } from 'react'
import { Link } from 'react-router-i18n'
import SearchBar from '../SearchBar/SearchBar'
import MobileNavOverlay from './MobileNavOverlay'
import NavLinks from './NavLinks'
import classNames from 'classnames'

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClick = () => {
    if (!menuOpen) setMenuOpen(true)
    if (menuOpen) setMenuOpen(false)
  }
  return (
    <>
      <div
        className={classNames(
          'cursor-pointer md:hidden block transition-all duration-200',
          {
            'opacity-100': !menuOpen,
            'opacity-0': menuOpen,
          },
        )}
        onClick={handleMenuClick}
      >
        <img src="/images/menu.svg" />
      </div>
      <MobileNavOverlay menuOpen={menuOpen} handleMenuClick={handleMenuClick} />
    </>
  )
}

const Header = () => {
  return (
    <header className="fixed w-full z-30 p-4 flex items-center justify-between">
      <Link to="/">
        <a>
          <img src="/images/logo-sm.svg" />
        </a>
      </Link>

      <div className="grid grid-flow-col gap-8 items-center">
        <NavLinks className="hidden md:grid grid-flow-col gap-4" />
        <div className="grid grid-flow-col gap-4 items-center">
          <SearchBar />
          <MenuButton />
        </div>
      </div>
    </header>
  )
}

export default Header
