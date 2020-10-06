import React, { Component } from 'react'
import { Typography, Tooltip, Spin } from 'antd'
import { CodeSandboxOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Block from '../../images/block.svg'

class BlockHeight extends Component {
  state = {
    height: 0,
    loading: true,
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
      this.setState({ height, loading: false })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { height, loading } = this.state
    return (
      <Tooltip placement="bottomRight" title="Current Block Height">
        <a
          className="block-height"
          href={`/blocks/${height}`}
          style={{ textAlign: 'center' }}
        >
          <img
            style={{ marginRight: 5, position: 'relative', top: '-1px' }}
            src={Block}
          />
          {!loading && height.toLocaleString()}
          {loading && <Spin size="small" />}
        </a>
      </Tooltip>
    )
  }
}

export default BlockHeight
