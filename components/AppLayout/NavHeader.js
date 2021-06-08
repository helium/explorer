import React from 'react'
import { Layout } from 'antd'
import Logo from './Logo'
import MapButton from './MapButton'
import SearchBar from '../SearchBar'
import Link from 'next/link'
import classNames from 'classnames'
import BetaBanner from '../BetaBanner/BetaBanner'
import { useContext } from 'react'
import BetaBannerContext from '../BetaBanner/BannerContext'

const { Header } = Layout

const NavHeader = () => {
  const { showBetaBanner, toggleBetaBanner } = useContext(BetaBannerContext)
  return (
    <>
      {showBetaBanner && <BetaBanner toggleBetaBanner={toggleBetaBanner} />}
      <Header
        className={classNames('z-40', { 'mt-14': showBetaBanner })}
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
