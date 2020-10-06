import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import BlockHeight from './BlockHeight'
import SearchBar from '../SearchBar'

const { Header } = Layout

const NavHeader = () => (
  <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
    <a href="/">
      <Logo />
    </a>
    <SearchBar />
    <BlockHeight />
  </Header>
)

export default NavHeader
