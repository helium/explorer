import classNames from 'classnames'
import Timestamp from 'react-timestamp'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import Pill from '../Common/Pill'
import { capitalize } from 'lodash'
import { useCallback } from 'react'
import AccountAddress from '../AccountAddress'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'

const SearchResult = ({ result, onSelect, selected = false }) => {
  const handleSelect = useCallback(() => {
    onSelect(result)
  }, [onSelect, result])

  if (result.type === 'hotspot') {
    return (
      <BaseSearchResult
        title={formatHotspotName(result.item.name)}
        subtitle={<FlagLocation geocode={result.item.geocode} />}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'validator') {
    return (
      <BaseSearchResult
        title={formatHotspotName(result.item.name)}
        subtitle={<ValidatorFlagLocation geocode={result.item.geo} />}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'account') {
    return (
      <BaseSearchResult
        title={<AccountAddress address={result.item.address} truncate />}
        subtitle={[
          result.item.balance.toString(2),
          result.item.secBalance.toString(2),
          result.item.dcBalance.toString(),
        ].join(' ')}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'block') {
    return (
      <BaseSearchResult
        title={`#${result.item.height.toLocaleString()}`}
        subtitle={
          <span className="flex space-x-2">
            <Timestamp date={result.item.time} />
            <span>{result.item.transactionCount.toLocaleString()} tx</span>
          </span>
        }
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }

  if (result.type === 'transaction') {
    return (
      <BaseSearchResult
        title={truncateHash(result.item.hash)}
        subtitle={<Timestamp date={result.item.time} />}
        type={result.type}
        selected={selected}
        onSelect={handleSelect}
      />
    )
  }
  return null
}

const BaseSearchResult = ({ title, subtitle, type, onSelect, selected }) => (
  <div
    className={classNames(
      'border-solid py-2 px-4 flex hover:bg-gray-350 cursor-pointer',
      {
        'bg-gray-350': selected,
      },
    )}
    onClick={onSelect}
  >
    <div className="w-full">
      <div className="font-medium text-base text-navy-1000">{title}</div>
      <div className="text-gray-700 text-sm">{subtitle}</div>
    </div>
    <div className="flex items-center px-2">
      <Pill title={capitalize(type)} />
    </div>
    <div className="flex">
      <img alt="" src="/images/details-arrow.svg" />
    </div>
  </div>
)

const truncateHash = (hash) => [hash.slice(0, 10), hash.slice(-10)].join('...')

export default SearchResult
