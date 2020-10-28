import React, { Component } from 'react'
import Sidebar, { SidebarHeader, SidebarScrollable } from './Sidebar'
import Hotspot from './Hotspot'
import animalHash from 'angry-purple-tiger'
import lowerCase from 'lodash/lowerCase'
import Link from 'next/link'
import { BarChartOutlined } from '@ant-design/icons'

export default class HotspotSidebar extends Component {
  state = {
    filter: '',
  }

  updateFilter = (e) => {
    this.setState({ filter: e.target.value })
  }

  loadMore = () => {
    return null
  }

  render() {
    const {
      hotspots,
      count,
      selectedHotspots,
      selectHotspots,
      clearSelectedHotspots,
    } = this.props

    const { filter } = this.state

    const matchesFilter = (string) =>
      lowerCase(string).includes(lowerCase(filter))

    const hotspotsToFilter =
      selectedHotspots.length > 0
        ? selectedHotspots
        : hotspots.length > 0
        ? hotspots
        : []

    const filteredHotspots = hotspotsToFilter.filter(
      (hotspot) =>
        matchesFilter(hotspot.location) ||
        matchesFilter(animalHash(hotspot.address)) ||
        matchesFilter(hotspot.owner),
    )

    let titleText = 'Hotspots'
    if (selectedHotspots.length > 0) {
      if (selectedHotspots.length > 1) {
        titleText = 'Hotspots Selected'
      } else {
        titleText = 'Hotspot Selected'
      }
    }

    const hotspotsToShow =
      selectedHotspots.length > 0 ? selectedHotspots : filteredHotspots

    return (
      <span className="coverage-map-sidebar">
        <Sidebar>
          <SidebarHeader>
            {selectedHotspots.length > 0 ? (
              <div className="header-search">
                <span
                  className="header-go-back"
                  onClick={clearSelectedHotspots}
                >
                  <img src="/images/back.svg" className="header-back-img" />{' '}
                  Back
                </span>
                {selectedHotspots.length === 1 && (
                  <>
                    <Link href={`/hotspots/${selectedHotspots[0].address}`}>
                      <a className="header-view-details">
                        View hotspot details
                        <BarChartOutlined style={{ marginLeft: 10 }} />
                      </a>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="header-search">
                <input
                  type="search"
                  className="search"
                  placeholder="Hotspot Lookup"
                  value={this.state.filter}
                  onChange={this.updateFilter}
                />
              </div>
            )}
            <div className="header-title-section">
              <span className="header-title mono">
                {selectedHotspots.length > 0 ? hotspotsToFilter.length : count}
              </span>
              <span className="header-subtitle mono">{titleText}</span>
            </div>
          </SidebarHeader>

          <SidebarScrollable loadMore={this.loadMore}>
            {hotspotsToShow.map((hotspot) => (
              <div key={hotspot.address}>
                <Hotspot
                  key={hotspot.address}
                  hotspot={hotspot}
                  selectHotspots={selectHotspots}
                />
              </div>
            ))}
          </SidebarScrollable>
        </Sidebar>
        <style jsx>{`
          .header-search {
            margin-bottom: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

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

          @media screen and (max-width: 890px) {
            .search {
              font-size: 16px;
              /* So that pressing on the input field on a phone doesn't cause the UI to zoom in slightly */
            }
          }

          .search::placeholder {
            color: #a0b0c2;
            opacity: 1;
          }

          .header-title-section {
            display: flex;
            align-items: flex-end;
            padding-top: 10px;
          }

          .header-title {
            color: #29d391;
            font-size: 60px;
            font-weight: 500;
            margin-right: 10px;
            line-height: 48px;
          }

          .header-subtitle {
            color: #a0b0c2;
            font-size: 16px;
            font-weight: 500;
            max-width: 200px;
            line-height: normal;
          }

          .header-go-back {
            color: #a0b0c2;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            width: 75px;
            padding: 6px 0;
          }

          .header-view-details {
            color: #a0b0c2;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 6px 0;
          }

          .header-back-img {
            height: 10px;
            margin-right: 6px;
          }
        `}</style>
      </span>
    )
  }
}
