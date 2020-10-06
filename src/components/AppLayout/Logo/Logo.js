import React from 'react'
import logo from './helium-logo-white.svg'
import logoMobile from './helium-logo-symbol-white.svg'

const Logo = () => (
  <div className="logo-container" style={{ float: 'left' }}>
    <img src={logo} className="logo-full" style={{ height: 30 }} alt="logo-full"/>
    <img src={logoMobile} className="logo-small" style={{ height: 30 }} alt="logo-small"/>
  </div>
)

export default Logo
