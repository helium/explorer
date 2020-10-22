import React from 'react'
import { colors } from './theme'

const size = '40px'

const GeolocationButton = ({ onClick }) => (
  <button onClick={onClick}>
    <img src={'/static/img/my-location.svg'} />
    <style jsx>{`
      button {
        background: ${colors.blue};
        width: ${size};
        height: ${size};
        border-radius: ${size};
        position: absolute;
        right: 40px;
        bottom: 40px;
        cursor: pointer;
        border: none;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
      }

      img {
        width: 24px;
      }
    `}</style>
  </button>
)

export default GeolocationButton
