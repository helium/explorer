import React, { Component } from 'react'
import classNames from 'classnames'
import animalHash from 'angry-purple-tiger'
import LocationIcon from '../../components/Icons/Location'

export default class Hotspot extends Component {
  handleClick = () => {
    const { hotspot, selectHotspots } = this.props
    if (hotspot.lat) {
      selectHotspots(hotspot)
    }
  }

  render() {
    const { hotspot } = this.props

    return (
      <div
        className={classNames('hotspot', 'group', {})}
        onClick={this.handleClick}
      >
        <header className="hotspot-header">
          <div className="hotspot-section">
            <div className="hotspot-location ">
              <LocationIcon className="group-hover:text-purple-500 text-gray-650 h-2.5 w-auto mr-1 location-white" />
              {hotspot.lat ? hotspot.location : 'No Location'}
            </div>
          </div>

          <div className="hotspot-section">
            <div className="hotspot-name">{animalHash(hotspot.address)}</div>
          </div>

          <div className="hotspot-section">
            <div className="hotspot-owner">
              <img className="owner" src="/images/owner.png" /> {hotspot.owner}
            </div>
          </div>
        </header>

        <style jsx>{`
          .hotspot {
            margin: 1px 0px;
            background: #293550;
          }

          .hotspot:first-of-type {
            margin-top: 0;
          }

          .hotspot:hover {
            background: #3f4d6c;
          }

          .hotspot-header {
            padding: 14px 20px;
            cursor: pointer;
          }

          .hotspot-name {
            font-size: 18px;
            color: #7787b4;
            margin-top: 2px;
          }

          .hotspot:hover .hotspot-name {
            color: #fff;
          }

          .hotspot:hover .hotspot-location,
          .hotspot:hover .hotspot-owner {
            color: #707ea4;
          }
          .hotspot-location {
            color: #707ea4;
            font-size: 10px;
            text-align: left;
            margin-top: 0px;
          }

          .hotspot-owner {
            font-size: 9px;
            color: #707ea4;
            margin-top: 8px;
            overflow: hidden;
            margin-top: 5px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }

          .hotspot-score {
            color: #a0b0c2;
            font-size: 13px;
            margin-top: -21px;
          }

          .owner {
            height: 10px;
            margin-right: 5px;
            display: inline-block;
            filter: saturate(0%);
            opacity: 0.4;
          }

          .hotspot:hover .owner {
            filter: saturate(100%);
            opacity: 1;
          }

          .score-circle {
            height: 20px;
            position: relative;
            top: 4px;
          }
        `}</style>
      </div>
    )
  }
}
