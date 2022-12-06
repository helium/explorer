import { useEffect, useMemo, useRef, useState } from 'react'
import { chunk, sumBy, takeRight } from 'lodash'
import classNames from 'classnames'
import { Balance, CurrencyType } from '@helium/currency'
import LargeBalance from '../Common/LargeBalance'
import Currency from '../Common/Currency'

import Skeleton from '../Common/Skeleton'
import { useMarket } from '../../data/market'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { format, addMinutes } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartJSTooltip,
  Legend,
)

// TODO: refactor custom tooltip to work with Chart.js
// const RewardTooltip = ({
//   active,
//   payload,
//   showTarget = false,
//   dataPointTimePeriod,
// }) => {
//   if (active && payload && payload.length) {
//     let amount
//     let target

//     if (showTarget) {
//       amount = Balance.fromFloat(payload[1].value, CurrencyType.networkToken)
//       target = Balance.fromFloat(payload[0].value, CurrencyType.networkToken)
//     } else {
//       amount = Balance.fromFloat(payload[0].value, CurrencyType.networkToken)
//     }

//     return (
//       <div className="bg-white bg-opacity-95 px-2 py-1 rounded-md shadow-md z-50">
//         {payload[0] && (
//           <div className="text-xs font-sans font-light text-gray-800">
//             {dataPointTimePeriod === 'hour'
//               ? formatHoursRange(payload[0].payload.timestamp)
//               : formatDaysRange(payload[0].payload.timestamp)}
//           </div>
//         )}
//         <div className="text-md font-sans font-semibold text-navy-400">
//           {showTarget ? 'Amount: ' : ''}
//           {amount.toString(2)}
//         </div>
//         {showTarget && (
//           <div className="text-sm font-sans font-medium text-darkgray-800">
//             Target: {target.toString(2)}
//           </div>
//         )}
//       </div>
//     )
//   }

//   return null
// }

const RewardsTrendWidget = ({
  title,
  periodSelector,
  series = [],
  isLoading,
  showTarget = false,
  targetSeries = [],
  dataPointTimePeriod = 'day',
  periodLabel,
  periodLength = 30,
  isMobile,
  padding = 3,
}) => {
  const { market } = useMarket()

  const DATA_POINTS_TO_SHOW = periodLength

  const iteratee = useMemo(() => (isMobile ? 'amount' : 'total'), [isMobile])

  const [firstValue, lastValue] = useMemo(() => {
    if (series.length <= DATA_POINTS_TO_SHOW) {
      return [0, sumBy(series, iteratee)]
    }
    return chunk(series, DATA_POINTS_TO_SHOW).map((s) => sumBy(s, iteratee))
  }, [DATA_POINTS_TO_SHOW, iteratee, series])

  const change = useMemo(() => {
    return (lastValue - firstValue) / firstValue
  }, [firstValue, lastValue])

  const dataToDisplay = useMemo(() => {
    return takeRight(series, DATA_POINTS_TO_SHOW)
  }, [DATA_POINTS_TO_SHOW, series])

  const actualEarningsData = useMemo(() => {
    return dataToDisplay.map((s) => {
      return {
        label: s.timestamp,
        value: s[iteratee],
      }
    })
  }, [dataToDisplay, iteratee])

  const averageEarningsData = useMemo(() => {
    if (showTarget) {
      const averages = dataToDisplay.map((s) => {
        const match = targetSeries.find(
          (t) => t?.date === s.timestamp.slice(0, 10),
        )
        if (match) {
          return {
            label: match.date,
            value: match.avg_rewards,
          }
        } else {
          return null
        }
      })
      return averages
    } else {
      return null
    }
  }, [dataToDisplay, showTarget, targetSeries])

  const chartOptions = useMemo(
    () => ({
      layout: { autoPadding: false },
      hover: { intersect: false },
      backdropPadding: 0,
      padding: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          // TODO: re-enable custom tooltip component
          // enabled: false,
          // external: customTooltip,
          caretPadding: 10,
          caretX: 0,
          caretY: 0,
          intersect: false,
          mode: 'index',
          yAlign: 'center',
          position: 'nearest',
          callbacks: {
            label: (item) => {
              const {
                dataset: { label },
              } = item
              const { raw } = item
              if (raw === 'N/A') {
                return ''
              }
              const amount = isMobile
                ? new Balance(raw, CurrencyType.mobile)
                : Balance.fromFloat(raw, CurrencyType.networkToken)
              return `${label}: ${amount.toString(3)}`
            },
          },
          displayColors: false,
          padding: 3,
          pointHitRadius: 5,
          pointRadius: 1,
          caretSize: 10,
          backgroundColor: 'rgba(255,255,255,.9)',
          borderWidth: 1,
          bodyFont: {
            family: 'Inter',
            size: 12,
          },
          bodyColor: '#303030',
          titleFont: {
            family: 'Inter',
          },
          titleColor: 'rgba(0,0,0,0.6)',
        },
      },
      scales: {
        y: {
          ticks: {
            display: false,
          },
          grid: {
            drawBorder: false,
            borderWidth: 0,
            drawTicks: false,
            color: 'transparent',
            width: 0,
            backdropPadding: 0,
          },
          drawBorder: false,
          drawTicks: false,
        },
        x: {
          ticks: {
            display: false,
          },
          grid: {
            drawBorder: false,
            borderWidth: 0,
            drawTicks: false,
            display: false,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }),
    [isMobile],
  )

  const chartContainerRef = useRef(null)
  const [chartContainerWidth, setChartContainerWidth] = useState(271)

  useEffect(() => {
    if (chartContainerRef?.current) {
      setChartContainerWidth(chartContainerRef.current.offsetWidth)
    }
  }, [chartContainerRef])

  const data = useMemo(() => {
    const width = chartContainerWidth / (dataToDisplay.length * 2)

    const labels = dataToDisplay.map((s) => {
      const date = new Date(s.timestamp)
      const utcOffset = date.getTimezoneOffset()
      const offsetDate = addMinutes(date, utcOffset)
      if (dataPointTimePeriod === 'day') {
        return format(offsetDate, 'MMM d')
      }
      return `${format(offsetDate, 'MMM d HH:mm')} UTC`
    })

    return {
      labels,
      datasets: [
        {
          label: 'Your Earnings',
          data: actualEarningsData.map((s) =>
            s?.value !== null ? s.value : null,
          ),
          backgroundColor: '#464eff',
          minBarLength: width,
          barThickness: width * 0.75,
          borderRadius: width * 0.75 * 2,
          borderSkipped: false,
        },
        {
          ...(showTarget && {
            label: 'Network Average',
            data: averageEarningsData.map((s) => s?.value || 'N/A'),
            backgroundColor: '#c7c8e9',
            minBarLength: width,
            barThickness: width * 0.75,
            borderRadius: width * 0.75 * 2,
            borderSkipped: false,
          }),
        },
      ],
    }
  }, [
    actualEarningsData,
    averageEarningsData,
    chartContainerWidth,
    dataPointTimePeriod,
    dataToDisplay,
    showTarget,
  ])

  return (
    <div
      className={`col-span-2 flex flex-col rounded-lg bg-gray-200 p-${padding}`}
    >
      <div
        className={classNames('flex', {
          'h-28': !periodSelector,
          'h-24': periodSelector,
        })}
      >
        <div className="relative w-1/3">
          <div className="absolute whitespace-nowrap text-sm text-gray-600">
            {title}
          </div>
          <div
            className={classNames('mt-1.5 pt-4 font-medium tracking-tight', {
              'text-2xl': isMobile,
              'text-3xl': !isMobile,
            })}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <LargeBalance
                value={
                  isMobile
                    ? lastValue * CurrencyType.mobile.coefficient
                    : lastValue
                }
              />
            )}
          </div>
          {!isMobile && (
            <div className="mb-1 w-full break-all text-base tracking-tight text-gray-600">
              {isLoading || !market ? (
                <Skeleton className="my-2 w-1/3" />
              ) : (
                <Currency value={lastValue * market?.price} isLarge />
              )}
            </div>
          )}
          {firstValue > 0 && (
            <div
              className={classNames('text-sm font-medium', {
                'text-green-500': change > 0,
                'text-navy-400': change < 0,
              })}
            >
              {change > 0 ? '+' : ''}
              {change.toLocaleString(undefined, {
                style: 'percent',
                maximumFractionDigits: 3,
              })}
            </div>
          )}
        </div>
        <div className="relative w-[99%] p-4 pr-0">
          <div className="h-full max-w-full" ref={chartContainerRef}>
            <Bar
              options={chartOptions}
              data={data}
              style={{
                maxWidth: chartContainerWidth ? chartContainerWidth : 271,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          {periodLabel && (
            <div className="absolute right-4 bottom-0 z-10 text-xs text-gray-550">
              {periodLabel}
            </div>
          )}
        </div>
      </div>
      {periodSelector}
    </div>
  )
}

export default RewardsTrendWidget
