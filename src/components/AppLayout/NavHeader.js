import React from 'react'
import { Layout, Menu } from 'antd'
import Logo from './Logo'
import BlockHeight from './BlockHeight'
import SearchBar from '../SearchBar'
import classNames from 'classnames'
import Fade from 'react-reveal/Fade'

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
