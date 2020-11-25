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
          {/*<div className="hotspot-section">
              <div className="hotspot-score mono"><img className="score-circle" src="/static/img/score-circle.png" /> {hotspot.score}</div>
            </div>*/}

          <div className="hotspot-section">
            <div className="hotspot-name">{animalHash(hotspot.address)}</div>
          </div>

          <div className="hotspot-section">
            <div style={{ display: 'inline-block' }}>
              <div className="hotspot-owner">
                <img className="owner" src="/images/owner.png" />{' '}
                <span className="truncate">{hotspot.owner}</span>
              </div>
            </div>
            <div className="hotspot-location">
              <img
                className="location-white"
                src="/images/location-white.png"
              />{' '}
              {hotspot.lat ? hotspot.location : 'No Location'}
            </div>
          </div>
        </header>

        <style jsx>{`
          .hotspot {
            margin: 1px 0px;
            background: rgba(66, 70, 110, 0.6);
            transition: all 0.2s;
            opacity: 1;
            padding: 16px 22px;
            box-sizing: border-box;
            position: relative;
          }

          .hotspot:hover {
            background: rgba(83, 86, 130, 0.6);
          }

          .hotspot-header {
            cursor: pointer;
          }

          .hotspot-name {
            font-family: 'soleil';
            font-size: 18px;
            color: #fff;
            margin-top: 6px;
            margin-bottom: 4px;
          }

          .hotspot-location {
            color: #a3a8e4;
            font-size: 12px;
            text-align: left;
            text-transform: uppercase;
            font-family: 'soleil';
            display: inline-block;
            position: absolute;
            right: 22px;
            bottom: 18px;
            max-width: 60%;
            white-space: nowrap;
            overflow: hidden;

            text-overflow: ellipsis;
          }

          .truncate {
            width: 100%;
            max-width: 35%;
            white-space: nowrap;
            overflow: hidden;
            font-family: 'soleil';

            text-overflow: ellipsis;
          }

          .hotspot-owner {
            font-size: 12px;
            color: #29d391;
            margin-top: 8px;
            overflow: hidden;
            margin-top: 6px;
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

          .location-white {
            height: 9px;
            margin-right: 3px;
            position: relative;
            top: -1px;
            opacity: 0.5;
          }

          .owner {
            height: 10px;
            margin-right: 5px;
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
