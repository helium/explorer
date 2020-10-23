import React, { Component } from 'react'
import classNames from 'classnames'
import PathOverview from './PathOverview'
import PathDetails from './PathDetails'
import { humanizeAddress, fraction } from '../util'
import { colors } from '../theme'

export default class Path extends Component {
  render() {
    const {
      path,
      active,
      onClick,
      showDetails,
      toggleDetails,
      makeInactive,
    } = this.props
    if (!active && showDetails) return null

    const witnesses = (path) => {
      var witnessList = []
      for (var i in path.targets) {
        if (path.targets[i].witnesses) {
          path.targets[i].witnesses.map((witness) => witnessList.push(witness))
        }
      }
      return witnessList
    }

    return (
      <div
        className={classNames('path', { active, showDetails })}
        onClick={onClick}
      >
        <header className="path-header">
          <div className="path-section">
            <span className="path-name">{path.name}</span>
            {!showDetails && (
              <div className="witnesses mono">
                <img
                  className="witness-icon"
                  src="/static/img/witness-icon.png"
                />
                {witnesses(path).length}
              </div>
            )}
          </div>

          {!showDetails && (
            <div className="path-section">
              {/*<span className="path-challenger mono">*/}

              <span className="target-location mono">
                <img className="sound-wave" src="/images/location-white.png" />{' '}
                {path.targets[0].location}
              </span>
            </div>
          )}

          {showDetails && (
            <div>
              <div className="constructed mono">Challenge Constructed By</div>
              <span className="path-challenger mono">
                {humanizeAddress(path.challenger.address)}
              </span>
            </div>
          )}

          <div className="path-section">
            <PathOverview
              active={active}
              showDetails={showDetails}
              complete={fraction(path).complete}
              total={fraction(path).total}
            />
          </div>
        </header>

        <div
          className={classNames('path-details', {
            visible: active && showDetails,
          })}
        >
          {active && <PathDetails path={path} witnesses={witnesses} />}
        </div>

        <div className="view-details mono" onClick={toggleDetails}>
          {showDetails ? 'Close Path Details' : 'View Path Details'}
        </div>

        <style jsx global>{`
          .path-details:not(.visible) > div {
            display: none;
          }
        `}</style>

        <style jsx>{`
          .path {
            margin: 14px;
            background: #263441;
            transition: all 0.2s;
            border-radius: 6px;
          }

          .path:hover {
            transform: scale(1.01);
            background: #364858;
          }

          .path.active {
            transform: scale(1.02);
            background: #3d5061;
            box-shadow: 0 11px 15px 0 #000;
          }

          .path.showDetails {
            margin: 0;
            transform: scale(1);
            box-shadow: none;
          }

          .path:not(.active):hover {
            cursor: pointer;
          }

          .path-header {
            padding: 12px;
          }

          .path-section {
            display: flex;
            justify-content: space-between;
          }

          .path-name {
            color: #6f7f91;
            font-size: 16px;
            margin-bottom: 15px;
          }

          .path-challenger {
            font-size: 12px;
            color: #aa79f7;
            margin-bottom: 12px;
          }

          .target {
            text-align: right;
            font-size: 13px;
            color: ${colors.lightGray};
            margin-bottom: 8px;
          }

          .target-location {
            text-align: right;
            font-size: 13px;
            color: white;
            margin-bottom: 15px;
          }

          .witnesses {
            color: #f4c271;
            font-size: 11px;
          }

          .witness-icon {
            height: 8px;
            position: relative;
            top: 1px;
            padding-right: 4px;
          }

          .sound-wave {
            /*height: 12px;*/
            height: 10px;
            position: relative;
            top: 1px;
            margin: 1px 2px 0px 0px;
          }

          .constructed {
            color: #a0b0c2;
            font-size: 10px;
            text-transform: uppercase;
            margin: 8px 0px 3px 0px;
          }

          .path.active .path-name {
            color: white;
          }

          .path.active .path-challenger {
            color: #aa79f7;
          }

          .path-details {
            height: 0px;
            background: #2d3d4e;
            transition: all 0.2s;
            opacity: 0;
          }

          .path-details.visible {
            height: 45vh;
            opacity: 1;
          }

          .view-details {
            display: none;
            background: #364858;
            color: #a2b7cf;
            font-size: 12px;
            text-align: center;
            padding: 12px 20px;
            border-radius: 0 0 6px 6px;
            transition: all 0.2s ease;
          }

          .view-details:hover {
            background: #304150;
            transition: all 0.2s ease;
          }

          .path.active .view-details {
            display: block;
          }

          .view-details:hover {
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}
