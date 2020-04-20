import React from 'react'
import { Layout, Menu } from 'antd'
import Logo from './Logo'
import BlockHeight from './BlockHeight'
const { Header } = Layout

const NavHeader = () => (
  <Header>
    <a href="/">
      <Logo />
    </a>
    <Menu theme="dark" mode="horizontal" style={{ float: 'right' }}>
      <Menu.Item>
        <BlockHeight />
      </Menu.Item>
    </Menu>
  </Header>
)

export default NavHeader
