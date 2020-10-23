import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'

const CoverageHeader = ({ activeNav }) => {
  return (
    <header>
      <Link href="/">
        <a>
          {/* Block Explorer */}
          <img className="logo" src="/images/logo.svg" />
        </a>
      </Link>

      <nav className="nav">
        <Link href="/coverage">
          <a
            // className={classNames({ active: activeNav === 'coverage' })}>
            className={'text-link'}
          >
            Hotspot Map
          </a>
        </Link>

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
        <Link href="/">
          <a
            // href="https://explorer.helium.com/"
            // <a
            // className={classNames({ active: activeNav === 'blocks' })}
            className={'text-link'}
          >
            Block Explorer
            {/* </a> */}
          </a>
        </Link>
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

        .text-link {
          text-decoration: none;
          color: #566d80;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 20px;
          transition: color 0.2s;
        }

        .text-link:hover {
          color: #b377ff;
        }

        .text-link.active {
          color: #b377ff;
        }
      `}</style>
    </header>
  )
}

export default CoverageHeader
