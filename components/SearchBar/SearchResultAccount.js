import React from 'react'
import AccountIcon from '../AccountIcon'

const SearchResultAccount = ({ address }) => (
  <div
    style={{
      display: 'flex',
      // justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <AccountIcon address={address} />
    <span style={{ marginLeft: 6 }}>{address}</span>
  </div>
)

export default SearchResultAccount
