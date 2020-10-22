import React, { Component } from 'react'
import Sidebar, { SidebarHeader, SidebarScrollable } from './Sidebar'
import Path from './Path'
import classNames from 'classnames'
import lowerCase from 'lodash/lowerCase'
import { humanizeAddress } from '../util'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { fetchPathsCount } from '../data/paths'
import { colors } from '../theme'
import some from 'lodash/some'
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from 'react-scroll'

export default class PathSidebar extends Component {
  activeRef = React.createRef()

  state = {
    filter: '',
  }

  componentDidUpdate(prevProps) {
    // if (
    //   this.props.activePath &&
    //   this.props.activePath !== prevProps.activePath
    // ) {
    //   this.activeRef.current.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'center',
    //   })
    // } else if (this.props.activePath) {
    //   this.activeRef.current.scrollIntoView()
    // }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  updateFilter = (e) => {
    this.setState({ filter: e.target.value })
  }

  render() {
    const {
      paths,
      activePath,
      count,
      toggleActivePath,
      showDetails,
      toggleDetails,
      makeInactive,
      loadMore,
    } = this.props

    const { filter } = this.state

    const matchesFilter = (string) =>
      lowerCase(string).includes(lowerCase(filter))

    const filteredPaths =
      paths &&
      paths.filter(
        (path) =>
          (activePath && path.id === activePath.id) ||
          matchesFilter(path.name) ||
          matchesFilter(path.challenger.address) ||
          matchesFilter(humanizeAddress(path.challenger.address)) ||
          some(
            path.targets,
            (target) =>
              matchesFilter(humanizeAddress(target.address)) ||
              matchesFilter(target.address) ||
              some(
                target.witnesses,
                (witness) =>
                  matchesFilter(humanizeAddress(witness.address)) ||
                  matchesFilter(witness.address),
              ),
          ),
      )

    return (
      <Sidebar autoHeight={showDetails}>
        <SidebarHeader collapse={showDetails}>
          <div className="header-search">
            <input
              type="search"
              className="search"
              placeholder="Hotspot Lookup"
              value={this.state.filter}
              onChange={this.updateFilter}
            />
          </div>

          <div className="header">
            <div className="header-title-section">
              <div className="completed">Completed (Last 24H)</div>
              <div className="completed-num mono">
                {this.props.count.completed}
              </div>
              <div className="ongoing status">
                {this.props.count.ongoing} Ongoing
              </div>
            </div>

            {/*<div>*/}
            {/*<div className="header">
              <div className="succeeded status">{this.props.count.succeeded} Succeeded</div>
              <div className="bar status">|</div>
              <div className="failed status">{this.props.count.failed} Failed</div>
            </div>*/}
            {/*</div>*/}
          </div>
        </SidebarHeader>

        <SidebarScrollable scroll={!showDetails} loadMore={this.props.loadMore}>
          {paths &&
            filteredPaths.map((path) => (
              <div
                key={path.id}
                ref={
                  activePath && path.id === activePath.id
                    ? this.activeRef
                    : null
                }
              >
                <Path
                  key={path.id}
                  path={path}
                  active={activePath && path.id === activePath.id}
                  onClick={() => toggleActivePath(path)}
                  showDetails={showDetails}
                  toggleDetails={toggleDetails}
                  makeInactive={makeInactive}
                />
              </div>
            ))}
          {paths && !showDetails}
        </SidebarScrollable>

        <style jsx>{`
          .header-search {
            margin-bottom: 20px;
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
          .search::placeholder {
            color: #a0b0c2;
            opacity: 1;
          }

          .header {
            display: flex;
          }

          .header-title-section {
            align-items: baseline;
            margin-top: 8px;
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

          .completed {
            color: white;
            font-size: 13px;
            text-transform: uppercase;
          }

          .completed-num {
            color: white;
            font-size: 36px;
            font-weight: 500;
            margin-top: 5px;
            display: inline-block;
            width: auto;
          }

          .status {
            font-size: 13px;
            margin-left: 7px;
            text-transform: uppercase;
          }

          .ongoing {
            color: ${colors.purple};
            /*padding-top: 27px;*/
            padding-top: 45px;
            margin-left: 15px;
            display: inline-block;
          }

          .succeeded {
            color: ${colors.green};
            margin-left: 15px;
            margin-top: -10px;
          }

          .bar {
            color: white;
            margin-top: -10px;
          }

          .failed {
            color: ${colors.red};
            margin-top: -10px;
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
