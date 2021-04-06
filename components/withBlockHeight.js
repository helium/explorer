import React from 'react'
import Client from '@helium/http'

const withBlockHeight = (WrappedComponent) => {
  class BlockHeight extends React.Component {
    state = {
      height: 0,
      heightLoading: true,
    }

    componentDidMount() {
      this.client = new Client()
      this.loadBlockHeight()
      window.setInterval(this.loadBlockHeight, 5000)
    }

    loadBlockHeight = async () => {
      await fetch('https://api.helium.io/v1/blocks/height')
        .then((res) => res.json())
        .then((res) =>
          this.setState({ height: res.data.height, heightLoading: false }),
        )
        .catch((error) => console.log(error))
    }

    render() {
      const { height, heightLoading } = this.state

      return (
        <WrappedComponent
          {...this.props}
          height={height}
          heightLoading={heightLoading}
        />
      )
    }
  }
  return BlockHeight
}

export default withBlockHeight
