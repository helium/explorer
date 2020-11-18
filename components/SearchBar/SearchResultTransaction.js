import React from 'react'

const SearchResultTransaction = ({ hash }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span>{hash}</span>
  </div>
)

export default SearchResultTransaction
