import React from 'react'
// import logo from './helium-logo-white.svg'
// import logoMobile from './helium-logo-symbol-white.svg'

const Logo = () => (
  <div className="logo-container" style={{ float: 'left' }}>
    <img
      src="/images/helium-logo-white.svg"
      className="logo-full"
      style={{ height: 30 }}
      alt="Helium logo"
    />
    <img
      src="/images/helium-logo-symbol-white.svg"
      className="logo-small"
      style={{ height: 30 }}
      alt="Helium logo"
    />
  </div>
)

export default Logo
