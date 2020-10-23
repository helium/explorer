import React, { Component } from 'react'
import classNames from 'classnames'
import animalHash from 'angry-purple-tiger'

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
      <div className={classNames('hotspot', {})} onClick={this.handleClick}>
        <header className="hotspot-header">
          <div className="hotspot-section">
            <div className="hotspot-location mono">
              <img
                className="location-white"
                src="/images/location-white.png"
              />{' '}
              {hotspot.lat ? hotspot.location : 'No Location'}
            </div>
          </div>

          {/*<div className="hotspot-section">
              <div className="hotspot-score mono"><img className="score-circle" src="/static/img/score-circle.png" /> {hotspot.score}</div>
            </div>*/}

          <div className="hotspot-section">
            <div className="hotspot-name">{animalHash(hotspot.address)}</div>
          </div>

          <div className="hotspot-section">
            <div className="hotspot-owner mono">
              <img className="owner" src="/images/owner.png" /> {hotspot.owner}
            </div>
          </div>
        </header>

        <style jsx>{`
          .hotspot {
            margin: 6px 14px;
            background: #263441;
            transition: all 0.2s;
            border-radius: 6px;
            opacity: 0.7;
          }

          .hotspot:hover {
            background: #364858;
          }

          .hotspot-header {
            padding: 12px;
            cursor: pointer;
          }

          .hotspot-name {
            font-size: 18px;
            color: #a0b0c2;
            margin-top: 10px;
            opacity: 0.6;
          }

          .hotspot-location {
            color: #a0b0c2;
            font-size: 10px;
            text-align: left;
            text-transform: uppercase;
            margin-top: 6px;
            opacity: 0.6;
          }

          .hotspot-owner {
            font-size: 10px;
            color: #a0b0c2;
            margin-top: 8px;
            display: inline-block;
            overflow: hidden;
            margin-top: 15px;
            opacity: 0.6;
          }

          .hotspot-score {
            color: #a0b0c2;
            font-size: 13px;
            margin-top: -21px;
          }

          .location-white {
            height: 9px;
          }

          .owner {
            height: 10px;
            display: inline-block;
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
