import React, { Component } from 'react'
import Sidebar, { SidebarHeader, SidebarScrollable } from './Sidebar'
import classNames from 'classnames'
import lowerCase from 'lodash/lowerCase'
import Block from './Block'

export default class BlocksSidebar extends Component {
  state = {
    filter: '',
  }

  constructor(props) {
    super(props)
  }

  updateFilter = (e) => {
    this.setState({ filter: e.target.value })
  }

  render() {
    const { blocks, activeBlock, toggleActiveBlock, loadMore } = this.props

    const { filter } = this.state

    const matchesFilter = (string) =>
      lowerCase(string).includes(lowerCase(filter))

    const filteredBlocks = blocks.filter(
      (block) => matchesFilter(block.hash) || matchesFilter(block.height),
    )

    return (
      <Sidebar>
        <SidebarHeader>
          <div className="header-search">
            <input
              type="search"
              className="search"
              placeholder="Block Lookup"
              value={this.state.filter}
              onChange={this.updateFilter}
            />
          </div>
        </SidebarHeader>

        <SidebarScrollable loadMore={this.props.loadMore}>
          {filteredBlocks.map((block) => (
            <Block
              key={block.hash}
              block={block}
              activeBlock={activeBlock}
              toggleActiveBlock={toggleActiveBlock}
            />
          ))}
        </SidebarScrollable>

        <style jsx>{`
          .search {
            background: #263441;
            width: 100%;
            padding: 8px 10px;
            font-size: 12px;
            color: #a0b0c2;
            -webkit-appearance: none;
            border-radius: 6px;
            border: none;
          }

          .search::placeholder {
            color: #a0b0c2;
            opacity: 1;
          }

          .header-title-section {
            display: flex;
            align-items: center;
          }

          .header-title {
            color: #29d391;
            font-size: 60px;
            font-weight: 500;
            margin-right: 20px;
          }

          .header-subtitle {
            color: #a0b0c2;
            font-size: 18px;
            font-weight: 500;
            max-width: 100px;
            line-height: normal;
          }

          button {
            background-color: #718397;
            border: none;
            color: #a2b7cf;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
            display: block;
            margin: 10px auto;
            padding: 7px;
            box-shadow: 0 4px 6px 0 #2c3947;
          }
        `}</style>
      </Sidebar>
    )
  }
}
