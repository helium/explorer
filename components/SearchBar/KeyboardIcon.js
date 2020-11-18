import React from 'react'
import Icon from '../../public/images/keyboard-icon.svg'
import { Tooltip } from 'antd'

const SIZE = 20

const KeyboardIcon = () => (
  <Tooltip title="Jump to search by pressing slash" placement="bottom">
    <img
      style={{
        height: SIZE,
        width: SIZE,
        display: 'inline',
      }}
      src={Icon}
      alt=""
    />
  </Tooltip>
)

export default KeyboardIcon
