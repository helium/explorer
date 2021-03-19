import React from 'react'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'

const Sidebar = ({ autoHeight = false, children }) => (
  <aside className={classNames({ autoHeight })}>
    {children}
    <style jsx>{`
      aside {
        position: fixed;
        background: #111724;
        bottom: 0px;
        left: 0px;
        top: 0px;
        width: 400px;
        display: flex;
        flex-direction: column;
        z-index: 1;
        border-radius: 0px;
        overflow: hidden;
        box-shadow: 0px 0px 46px #121723;
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
          top: 30vh;
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
      background: '#111724',
      padding: 22,
      opacity: 1,
      transition: 'all 0.2s',
      display: 'block',
    }}
  >
    {children}
    <style jsx>{`
      header {
        background: #0c151e;
        padding: 22px;
        opacity: 1;
        transition: all 0.2s;
        display: block;
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
    <section className={classNames({ scroll })}>
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
  <section className="scroll">
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
      section.scroll::-webkit-scrollbar {
        display: none;
      }

      section.scroll {
        overflow-y: scroll;
      }
    `}</style>
  </section>
)

export default Sidebar
