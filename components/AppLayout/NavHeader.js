import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import BlockHeight from './BlockHeight'
import SearchBar from '../SearchBar'
import Link from 'next/link'

const { Header } = Layout

const NavHeader = () => (
  <Header
    className="header"
    style={{
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
    <BlockHeight />
  </Header>
)

export default NavHeader
