import React from 'react'
import { Rings as Identicon } from 'react-identicon-variety-pack'

const AccountIcon = ({ address, size = 24, style, className }) => (
  <Identicon
    style={style}
    className={className}
    size={size}
    seed={address}
    circle
  />
)

export default AccountIcon
