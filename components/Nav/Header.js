import classNames from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-i18n'
import SearchBar from '../SearchBar/SearchBar'

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
        'md:hidden transform-gpu absolute transition-all duration-100 ease-in-out top-0 z-50 left-0 h-screen w-screen bg-navy-900 opacity-90',
        { 'translate-x-full': !menuOpen, 'translate-x-0': menuOpen },
      )}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="relative flex flex-col items-center justify-center h-screen w-full p-10">
        <button
          className="absolute cursor-pointer top-4 right-4 w-10 h-10 flex items-center justify-center outline-none border-solid border border-transparent focus:border-navy-400"
          onClick={handleMenuClick}
        >
          <img src="/images/close-menu.svg" />
        </button>
        <NavLinks
          className="flex flex-col items-center justify-center space-y-8"
          navLinkClasses="text-xl text-white font-sans font-semibold border-solid border border-transparent focus:border-navy-400 hover:text-gray-600"
          onNavLinkClick={handleMenuClick}
        >
          <div className="pt-5" />
          <button
            className="cursor-pointer w-10 h-10 flex items-center justify-center outline-none border-solid border border-transparent focus:border-navy-400"
            onClick={handleMenuClick}
          >
            <img src="/images/close-menu.svg" />
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
