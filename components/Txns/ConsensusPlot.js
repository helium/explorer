import React, { Component } from 'react'
import { Checkbox } from 'antd'

import dynamic from 'next/dynamic'

const ConsensusMapbox = dynamic(() => import('../ConsensusMapbox'), {
  ssr: false,
  loading: () => <span style={{ height: '600px' }} />,
})
// TODO get lat/lon for all 16 txn.members hotspots
const initialState = {
  loading: true,
  loadingInitial: true,
  showWitnesses: false,
}

class ConsensusPlot extends Component {
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
    const { txn } = this.props

    if (!loadingInitial) {
      return (
        <span>
          <ConsensusMapbox
            members={txn.members}
            showWitnesses={showWitnesses}
          />
        </span>
      )
    } else {
      return <div>loading</div>
    }
  }
}

export default ConsensusPlot
