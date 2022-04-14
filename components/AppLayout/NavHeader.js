import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import MapButton from './MapButton'
import SearchBar from '../SearchBar'
import Link from 'next/link'

const { Header } = Layout

const NavHeader = () => {
  return (
    <>
      <Header
        className="z-40"
        style={{
          backgroundColor: '#101725',
          display: 'flex',
          position: 'fixed',
          width: '100%',
          top: 0,
          justifyContent: 'space-between',
        }}
      >
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <SearchBar />
        <MapButton />
      </Header>
    </>
  )
}

export default NavHeader
