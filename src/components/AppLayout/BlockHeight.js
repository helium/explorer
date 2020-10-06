import React, { Component } from 'react'
import { Typography, Tooltip, Spin } from 'antd'
import { CodeSandboxOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Block from '../../images/block.svg'
import withBlockHeight from '../withBlockHeight'

class BlockHeight extends Component {
  render() {
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
            alt=""
          />
          {!this.props.heightLoading && this.props.height.toLocaleString()}
          {this.props.heightLoading && <Spin size="small" />}
        </a>
      </Tooltip>
    )
  }
}

const WrappedBlockHeight = withBlockHeight(BlockHeight)

export default WrappedBlockHeight
