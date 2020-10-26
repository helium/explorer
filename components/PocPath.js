import React, { Component } from 'react'
import { Checkbox } from 'antd'

import dynamic from 'next/dynamic'

const PocMapbox = dynamic(() => import('./PocMapbox'), {
  ssr: false,
  loading: () => <div />,
})

const initialState = {
  loading: true,
  loadingInitial: true,
  showWitnesses: false,
}

class PocPath extends Component {
  state = initialState

  async componentDidMount() {
    this.setState({ loadingInitial: false })
  }

  toggleWitnesses = (e) => {
    this.setState({
      showWitnesses: e.target.checked,
    })
  }

  render() {
    const { loadingInitial, showWitnesses } = this.state
    const { path } = this.props

    if (!loadingInitial) {
      return (
        <span>
          <PocMapbox path={path} showWitnesses={showWitnesses} />
          <Checkbox
            onChange={this.toggleWitnesses}
            style={{ color: 'black', float: 'right' }}
          >
            Show witnesses
          </Checkbox>
        </span>
      )
    } else {
      return <div>loading</div>
    }
  }
}

export default PocPath
