import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import MapButton from './MapButton'
import SearchBar from '../SearchBar'
import Link from 'next/link'

const { Header } = Layout

const NavHeader = () => (
  <Header
    // className="header"
    style={{
      backgroundColor: '#101725',
      display: 'flex',
      position: 'fixed',
      zIndex: 10,
      width: '100%',
      marginTop: '-64px',
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
)

export default NavHeader
