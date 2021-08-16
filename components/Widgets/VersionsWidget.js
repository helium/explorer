import { max, sum } from 'lodash'
import { Tooltip } from 'antd'
import { formatVersion } from '../Validators/utils'
import { useMemo } from 'react'
import useApi from '../../hooks/useApi'

const makePercent = (count, total) => (count / total) * 100 + '%'

const green = '#29D391'
const yellow = '#FFC769'
const gray = '#ccc'

const versionColor = (version, index) => {
  if (version === '1') return gray
  if (index > 0) return yellow
  return green
}

const VersionsWidget = () => {
  const { data: versionCounts } = useApi('/validators/versions')

  const isLoading = useMemo(() => !versionCounts, [versionCounts])
  const totalValidators = useMemo(() => {
    if (!versionCounts) return 0

    return sum(Object.values(versionCounts))
  }, [versionCounts])

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm whitespace-nowrap">
        Validator Versions
      </div>
      <div className="h-6 w-full my-3 rounded-lg flex overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse bg-gray-400 w-full" />
        ) : (
          Object.keys(versionCounts)
            .sort()
            .reverse()
            .map((version, i) => (
              <Tooltip
                title={`${formatVersion(version)} (${versionCounts[version]})`}
              >
                <div
                  key={version}
                  style={{
                    background: versionColor(version, i),
                    width: makePercent(versionCounts[version], totalValidators),
                    marginRight: 1,
                  }}
                />
              </Tooltip>
            ))
        )}
      </div>
      <div>
        {isLoading ? (
          <div className="animate-pulse bg-gray-400 w-1/4 h-4 rounded-md" />
        ) : (
          <span className="font-mono text-gray-800 text-sm">
            Latest Version:{' '}
            {formatVersion(max(Object.keys(versionCounts))) || ' N/A'}
          </span>
        )}
      </div>
    </div>
  )
}

export default VersionsWidget
