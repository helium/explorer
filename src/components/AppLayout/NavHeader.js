import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
const { Header } = Layout

const NavHeader = () => (
    <Header>
      <a href="/">
        <Logo />
      </a>
    </Header>
)

export default NavHeader
