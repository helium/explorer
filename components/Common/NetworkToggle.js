import classNames from 'classnames'
import { capitalize } from 'lodash'
import { NETWORK } from '../../data/client'

const NetworkToggle = () => {
  // for now hide on mainnet explorer
  if (NETWORK === 'mainnet') {
    return null
  }

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={
        NETWORK === 'testnet'
          ? 'https://explorer.helium.com'
          : 'https://testnet-explorer.helium.com'
      }
      className={classNames(
        'text-white text-sm cursor-pointer bg-opacity-80 px-3 py-2 rounded hidden md:block absolute left-96',
        {
          'bg-yellow-800': NETWORK === 'testnet',
          'bg-navy-500': NETWORK === 'mainnet',
        },
      )}
    >
      {capitalize(NETWORK)}
    </a>
  )
}

export default NetworkToggle
