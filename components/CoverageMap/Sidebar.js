import React from 'react'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'
import Link from 'next/link'

const Sidebar = ({ autoHeight = false, children }) => (
  <aside className={classNames({ autoHeight })}>
    {children}
    <style jsx>{`
      aside {
        position: fixed;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: saturate(100%) blur(30px);
        bottom: 0px;
        left: 0px;
        top: 0px;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        z-index: 1;
        overflow: hidden;
        box-shadow: 0 0px 60px 0 rgba(0, 0, 0, 0.5);
      }

      aside.autoHeight {
        bottom: auto;
      }
      @media screen and (max-width: 890px) {
        aside {
          width: 100%;
          left: 0px;
          right: 0px;
          bottom: 0px;
          top: 50vh;
          max-width: none;
          border-radius: 0px;
        }
      }
    `}</style>
  </aside>
)

export const SidebarHeader = ({ collapse = false, children }) => (
  <header
    className={classNames({ collapse })}
    style={{
      padding: 22,
      opacity: 1,
      transition: 'all 0.2s',
      display: 'block',
    }}
  >
    <Link href="/">
      <a className="back-container">
        <img src="/images/back.svg" className="back-image" />
        <span className="back-text">Block Explorer</span>
      </a>
    </Link>

    {children}
    <style jsx>{`
      header {
        padding: 22px;
        opacity: 1;
        transition: all 0.2s;
        display: block;
      }
      .back-container {
        min-width: 150px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .back-image {
        height: 12px;
        padding-right: 5px;
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

      header.collapse {
        height: 0;
        padding: 0;
        opacity: 0;
        display: none;
      }
    `}</style>
  </header>
)

export const SidebarScrollable = ({
  scroll = true,
  infinite = true,
  loadMore,
  children,
}) =>
  infinite ? (
    <InfiniteScrollSidebar children={children} loadMore={loadMore} />
  ) : (
    <section className={classNames({ scroll })} style={{ overflowY: 'scroll' }}>
      {children}
      <style jsx>{`
        section {
          // overflow: hidden;
        }

        section.scroll {
          overflow-y: scroll;
        }
      `}</style>
    </section>
  )

const InfiniteScrollSidebar = ({ loadMore, children }) => (
  <section className="scroll" style={{ overflowY: 'scroll' }}>
    {children.length > 0 && (
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={loadMore}
        hasMore={true}
        useWindow={false}
      >
        <React.Fragment children={children} />
      </InfiniteScroll>
    )}

    <style jsx>{`
      section.scroll {
        overflow-y: scroll;
      }
    `}</style>
  </section>
)

export default Sidebar
