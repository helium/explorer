import React from 'react'
import { Link } from 'react-router-dom'

const NavLink = ({ href, title }) => (
  <Link to={href}>
    <a className="text-white font-medium text-base">{title}</a>
  </Link>
)

const SearchButton = () => (
  <div className="cursor-pointer">
    <img src="/images/search.svg" />
  </div>
)

const MenuButton = () => (
  <div className="cursor-pointer">
    <img src="/images/menu.svg" />
  </div>
)

const Header = ({ activeNav }) => {
  return (
    <header className="fixed w-full z-10 p-4 flex items-center justify-between">
      <Link to="/">
        <a>
          <img src="/images/logo-sm.svg" />
        </a>
      </Link>

      <div className="grid grid-flow-col gap-8 items-center">
        <div className=" hidden md:grid grid-flow-col gap-4">
          <NavLink href="/hotspots" title="Hotspots" />
          <NavLink href="/beacons" title="Beacons" />
          <NavLink href="/blocks" title="Blocks" />
          <NavLink href="/consensus" title="Validators" />
          <NavLink href="/market" title="Market" />
        </div>

        <div className="grid grid-flow-col gap-4 items-center">
          <SearchButton />
          <MenuButton />
        </div>
      </div>
    </header>
  )
}

export default Header
