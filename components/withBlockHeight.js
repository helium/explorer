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
      window.setInterval(this.loadBlockHeight, 30000)
    }

    loadBlockHeight = async () => {
      try {
        const blocks = await this.client.blocks.list()
        const [{ height }] = await blocks.take(1)
        this.setState({ height, heightLoading: false })
      } catch (error) {
        console.log(error)
      }
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
