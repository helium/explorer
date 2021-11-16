import { capitalize } from 'lodash'
import Pill from '../Common/Pill'
import classNames from 'classnames'

const pillColors = {
  validator: 'purple',
  hotspot: 'green',
  hex: 'green',
}

const pillTitles = {
  dataonly: 'Data Only',
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
      {type && (
        <Pill
          title={pillTitles[type] ? pillTitles[type] : capitalize(type)}
          color={pillColors[type] || 'gray'}
        />
      )}
    </div>
    <div className="flex">
      <img alt="" src="/images/details-arrow.svg" />
    </div>
  </div>
)

export default BaseSearchResult
