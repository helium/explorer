import React, { Component } from 'react'
import { Tooltip, Spin } from 'antd'
import Block from '../../public/images/block.svg'
import withBlockHeight from '../withBlockHeight'
import Link from 'next/link'

class BlockHeight extends Component {
  render() {
    return (
      <Tooltip placement="bottomRight" title="Current Block Height">
        <Link href={`/blocks/${this.props.height}`}>
          <a
            className="block-height"
            style={{ textAlign: 'center', lineHeight: 1.5715 }}
          >
            <img
              style={{
                marginRight: 5,
                position: 'relative',
                height: 17,
                width: 15,
              }}
              src={Block}
              alt=""
            />
            {!this.props.heightLoading && (
              <span style={{ lineHeight: 1.5715 }}>
                {this.props.height.toLocaleString()}
              </span>
            )}
            {this.props.heightLoading && <Spin size="small" />}
          </a>
        </Link>
      </Tooltip>
    )
  }
}

const WrappedBlockHeight = withBlockHeight(BlockHeight)

export default WrappedBlockHeight
