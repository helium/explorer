import React from 'react'
import { Tooltip, Spin } from 'antd'
import Block from '../../public/images/block.svg'
import Link from 'next/link'
import { useStats } from '../../data/stats'

const BlockHeight = () => {
  const { stats, isLoading } = useStats()
  const height = stats?.totalBlocks

  return (
    <Tooltip placement="bottomRight" title="Current Block Height">
      <Link href={`/blocks/${height}`}>
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
          {!isLoading && (
            <span style={{ lineHeight: 1.5715 }}>
              {height.toLocaleString()}
            </span>
          )}
          {isLoading && <Spin size="small" />}
        </a>
      </Link>
    </Tooltip>
  )
}

export default BlockHeight
