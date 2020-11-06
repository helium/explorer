import React from 'react'

const SearchResultAccount = ({ address }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span>{address}</span>
  </div>
)

export default SearchResultAccount
