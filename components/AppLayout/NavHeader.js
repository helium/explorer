import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import MapButton from './MapButton'
import SearchBar from '../SearchBar'
import Link from 'next/link'
import classNames from 'classnames'
import Banner from '../Banner/Banner'
import { useContext } from 'react'
import BannerContext from '../Banner/BannerContext'

const { Header } = Layout

const NavHeader = () => {
  const { showBanner, toggleBanner } = useContext(BannerContext)
  return (
    <>
      {showBanner && <Banner toggleBetaBanner={toggleBanner} />}
      <Header
        className={classNames('z-40', { 'mt-14': showBanner })}
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
