import React from 'react'
import Link from 'next/link'

const CoverageHeader = ({ activeNav }) => {
  return (
    <header
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Link href="/">
        <a className="back-container">
          <img src="/images/back.svg" className="back-image" />
          <span className="back-text">Block Explorer</span>
        </a>
      </Link>

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

        @media screen and (max-width: 890px) {
          header {
            padding: 0 10px;
          }
        }

        .back-container {
          min-width: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .back-image {
          height: 22px;
          padding: 5px;
        }

        .back-text {
          text-decoration: none;
          color: #a0b0c2;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 5px;
          transition: color 0.2s;
        }

        .back-text:hover {
          color: #b377ff;
        }
        .back-image:hover {
          fill: #b377ff;
        }

        .back-text.active {
          color: #b377ff;
        }
      `}</style>
    </header>
  )
}

export default CoverageHeader
