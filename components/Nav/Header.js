import classNames from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-i18n'
import SearchBar from '../SearchBar/SearchBar'

const NavLinks = ({ className, children }) => {
  const NavLink = ({ href, title, onClick }) => (
    <Link
      to={href}
      onClick={onClick}
      className="text-white font-medium text-base"
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
      <MobileMenu menuOpen={menuOpen} handleMenuClick={handleMenuClick} />
    </>
  )
}

const MobileMenu = ({ menuOpen, handleMenuClick }) => {
  return (
    <div
      className={classNames(
        'transform-gpu absolute transition-all duration-100 ease-in-out top-0 z-50 left-0 h-screen w-screen filter grayscale bg-navy-900 opacity-90',
        { 'translate-x-full': !menuOpen, 'translate-x-0': menuOpen },
      )}
    >
      <div className="relative flex flex-col items-center justify-center h-screen w-full p-10">
        <button
          className="absolute cursor-pointer top-4 right-4 w-10 h-10 flex items-center justify-center"
          onClick={handleMenuClick}
        >
          <img src="/images/close-menu.svg" />
        </button>
        <NavLinks className="flex flex-col items-center justify-center space-y-4">
          <button
            className="text-white text-lg font-sans w-40 bg-purple-700"
            onClick={handleMenuClick}
          >
            x
          </button>
        </NavLinks>
      </div>
    </div>
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
