import React, { Component } from 'react'
import { Typography, Tooltip, Spin } from 'antd'
import { CodeSandboxOutlined } from '@ant-design/icons'
import Client from '@helium/http'

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
    const blocks = await this.client.blocks.list()
    const [{ height }] = await blocks.take(1)
    this.setState({ height, loading: false })
  }

  render() {
    const { height, loading } = this.state
    return (
      <Tooltip title="Current Block Height">
        <a href="/">
          <CodeSandboxOutlined />
          {!loading && height.toLocaleString()}
          {loading && <Spin size="small" />}
        </a>
      </Tooltip>
    )
  }
}

export default BlockHeight
