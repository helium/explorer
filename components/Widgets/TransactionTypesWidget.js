import { countBy } from 'lodash'
import { Tooltip } from 'antd'
import { useMemo } from 'react'
import { getTxnTypeColor, getTxnTypeName } from '../../utils/txns'

const makePercent = (count, total) => (count / total) * 100 + '%'

const TransactionTypesWidget = ({ txns }) => {
  const txnCounts = countBy(txns, 'type')
  const totalTxns = txns.length
  const isLoading = useMemo(() => txns.length === 0, [txns.length])

  return (
    <div className="bg-white px-5 pt-3 rounded-lg col-span-2">
      <div className="h-6 w-full my-3 rounded-lg flex overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse bg-white w-full" />
        ) : (
          Object.keys(txnCounts)
            .sort((a, b) => txnCounts[b] - txnCounts[a])
            .map((type, i) => (
              <Tooltip
                placement="bottom"
                title={`${getTxnTypeName(type)} (${txnCounts[type]})`}
              >
                <div
                  key={type}
                  style={{
                    background: getTxnTypeColor(type),
                    width: makePercent(txnCounts[type], totalTxns),
                    marginRight: 1,
                  }}
                />
              </Tooltip>
            ))
        )}
      </div>
    </div>
  )
}

export default TransactionTypesWidget
