import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Widget from './Widget'
import { Button, Input } from 'antd'
import { fetchHotspotRewardsSum } from '../../data/rewards'
import { fetchMarket } from '../../data/market'
import { isDataOnly } from '../Hotspots/utils'

const AhrWidget = ({ hotspot }) => {
  const [hotspotCost, setHotspotCost] = useState(500)
  const [breakevenTime, setBreakevenTime] = useState(0)
  const [ahr, setAhr] = useState(0)
  const [rewardsSum, setRewardsSum] = useState(0)
  const [marketPrice, setMarketPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const hotspotCostInput = useRef()

  const onChangeCost = useCallback((e) => {
    const cost = Number.parseInt(e.target.value)
    if (cost < 1 || cost > 1000000 || isNaN(cost)) {
      setHotspotCost(0)
      return
    }
    setHotspotCost(cost)
  }, [])

  const onCalculateAHR = useCallback(async () => {
    setLoading(true)
    const rewards = await fetchHotspotRewardsSum(
      hotspot.address,
      30,
      'day'
    )
    const { price } = await fetchMarket()
    setRewardsSum(rewards)
    setMarketPrice(price)
    setLoading(false)
  }, [hotspot.address])

  useEffect(() => {
    if (!hotspotCost) {
      setBreakevenTime(0)
      setAhr(0)
      return
    }
    const usdPerMonth = rewardsSum * marketPrice
    const usdPerYear = usdPerMonth * 12
    setBreakevenTime(hotspotCost / usdPerMonth)
    setAhr((usdPerYear / hotspotCost) * 100)
  }, [hotspotCost, marketPrice, rewardsSum])

  const CalculateView = useMemo(() => (
    <>
      <Button
        type="primary"
        size="large"
        style={styles.button}
        onClick={onCalculateAHR}
        loading={loading}
      >
        Calculate AHR
      </Button>
      <span className="text-sm font-light">
        AHR is retrospective and can change daily based on past earnings.
      </span>
    </>
  ), [loading, onCalculateAHR])

  const AHRView = useMemo(() => (
    <div style={styles.ahrContainer} >
      {rewardsSum ? (
        <>
          <span className="font-medium" style={styles.ahrText}>
            {`${ahr.toFixed(2)}%`}
          </span>
          <span className="font-light" style={styles.breakevenText}>
            {`This Hotspot's breakeven time is ${breakevenTime.toFixed(2)} months.`}
          </span>
        </>
      ) : (
        <span className="font-light" style={styles.breakevenTextNoReward}>
          {'This Hotspot has not mined in the last 30 days. Unable to calculate AHR.'}
        </span>
      )}
    </div>
  ), [ahr, breakevenTime, rewardsSum])

  const tooltip = useMemo(() => (
    <>
      <div>
        AHR is the Annualized Hotspot Return for the indicated Hotspot. The AHR
        is estimated based on the Hotspot's actual $HNT earnings during the prior
        30 days, using a 365-day calendar year and the present $HNT market price
        from <a target="_blank" rel="noreferrer" href="https://www.coingecko.com/en/coins/helium">CoinGecko</a>.
      </div>
      <br />
      <div>
        The AHR is calculated without considering additional expenses and taxes. Past performance does not guarantee future results.
      </div>
    </>
  ), [])

  if (isDataOnly(hotspot)) {
    return null
  }

  return (
    <Widget
      title="AHR"
      span={2}
      subtitle={(
        <div className="flex flex-row justify-center">
          <div style={styles.leftContainer}>
            <Input
              ref={hotspotCostInput}
              style={styles.input}
              type="number"
              value={hotspotCost}
              prefix="$"
              onChange={onChangeCost}
              className={'border-none outline-none text-base'}
            />
            <span className="text-sm font-light">Hotspot Price in USD</span>
          </div>
          <div className="flex flex-col justify-center" style={styles.rightContainer}>
            {marketPrice ? AHRView : CalculateView}
          </div>
        </div>
      )}
      tooltip={tooltip}
    />
  )
}

const styles = {
  leftContainer: {
    width: '50%',
    paddingRight: 8
  },
  rightContainer: {
    width: '50%',
    paddingLeft: 8
  },
  breakevenText: {
    textAlign: "left",
    fontSize: 12,
  },
  breakevenTextNoReward: {
    textAlign: "left",
    fontSize: 16,
  },
  ahrText: {
    width: '100%',
    textAlign: "center",
    fontSize: 32,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'black',
    paddingBottom: 8
  },
  ahrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 16,
    height: '100%'
  },
  button: {
    background: "#878AAC",
    borderColor: '#878AAC',
    height: 50,
    marginBottom: 8,
    borderRadius: 8
  },
  input: {
    height: 50,
    marginBottom: 8,
    borderRadius: 8
  }
}

export default memo(AhrWidget)
