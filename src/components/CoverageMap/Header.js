import classNames from 'classnames'
import Link from 'next/link'

export default ({ activeNav }) => (
  <header>
    <Link href="/">
      <img className="logo" src="/static/img/logo.svg" />
    </Link>

    <nav className="nav">
      <Link href="/coverage">
        <a className={classNames({ active: activeNav === 'coverage' })}>
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

      <Link href="https://explorer.helium.com/">
        <a className={classNames({ active: activeNav === 'blocks' })}>
          Block Explorer
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
