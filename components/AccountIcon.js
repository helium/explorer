import React from 'react'
import { Rings as Identicon } from 'react-identicon-variety-pack'

const AccountIcon = ({ address, size = 24, style }) => (
  <Identicon style={style} size={size} seed={address} circle />
)

export default AccountIcon
