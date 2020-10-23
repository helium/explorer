import React from 'react'
import classNames from 'classnames'
// import Link from 'next/link'

const CoverageHeader = ({ activeNav }) => {
  return (
    <header>
      <a href="/">
        <img className="logo" src="/images/logo.svg" />
      </a>

      <nav className="nav">
        {/* <Link
      > */}
        <a
          href="/coverage"
          className={classNames({ active: activeNav === 'coverage' })}
        >
          Hotspot Map
        </a>
        {/* </Link> */}

        {/*<Link href="/challenges">
        <a className={classNames({ active: activeNav === 'challenges' })}>
          Challenges
        </a>
      </Link>

      {true && (
        <Link href="/consensus">
          <a className={classNames({ active: activeNav === 'consensus' })}>
            Consensus
          </a>
        </Link>
      )}*/}

        <a
          href="https://explorer.helium.com/"
          // <a
          className={classNames({ active: activeNav === 'blocks' })}
        >
          Block Explorer
          {/* </a> */}
        </a>
      </nav>

      <style jsx>{`
        header {
          position: fixed;
          top: 0px;
          right: 0px;
          left: 0px;
          height: 50px;
          background: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          z-index: 1;
        }

        .logo {
          height: 28px;
        }

        .logo:hover {
          cursor: pointer;
        }

        a {
          text-decoration: none;
          color: #566d80;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 20px;
          transition: color 0.2s;
        }

        a:hover {
          color: #b377ff;
        }

        a.active {
          color: #b377ff;
        }
      `}</style>
    </header>
  )
}

export default CoverageHeader
