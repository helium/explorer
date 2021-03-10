import React from 'react'
import Client from '@helium/http'
import countBy from 'lodash/countBy'
import AppLayout from '../../components/AppLayout'
import HotspotChart from '../../components/Hotspots/HotspotChart'
import LatestHotspotsTable from '../../components/Hotspots/LatestHotspotsTable'
import { fetchStats, useStats } from '../../data/stats'
import { sub, compareAsc, getUnixTime } from 'date-fns'
import { useLatestHotspots } from '../../data/hotspots'
import TopBanner from '../../components/AppLayout/TopBanner'
import TopChart from '../../components/AppLayout/TopChart'
import HotspotsImg from '../../public/images/hotspots.svg'
import Widget from '../../components/Home/Widget'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Balance, CurrencyType } from '@helium/currency'

const MiniCoverageMap = dynamic(
  () => import('../../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

function Hotspots({
  hotspotGrowth,
  onlineHotspotCount,
  latestHotspots: initialLatestHotspots,
  stats: initialStats,
  makers,
}) {
  const {
    stats: { totalHotspots, totalCities, totalCountries },
  } = useStats(initialStats)
  const { latestHotspots } = useLatestHotspots(initialLatestHotspots)

  return (
    <AppLayout
      title={'Hotspots'}
      description={
        'An overview of the Hotspots that make up the Helium network'
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/hotspots.png`}
      url={`https://explorer.helium.com/accounts/hotspots`}
    >
      <TopBanner icon={HotspotsImg} title="Hotspots" />
      <TopChart
        title="Hotspot Network Growth"
        chart={<HotspotChart data={hotspotGrowth} />}
      />
      <div className="max-w-screen-xl mx-auto px-10 pt-5 pb-24">
        {/* Stats section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Widget
            title="Total Hotspots"
            value={totalHotspots.toLocaleString()}
            change={
              ((totalHotspots - hotspotGrowth.slice(-11, -10)[0].count) /
                totalHotspots) *
              100
            }
            changeSuffix="%"
          />
          <Widget
            title="Hotspots Online"
            value={onlineHotspotCount.toLocaleString()}
            change={(onlineHotspotCount / totalHotspots) * 100}
            changeSuffix="%"
            changeIsAmbivalent
          />
          <Widget title="Cities" value={totalCities.toLocaleString()} />
          <Widget title="Countries" value={totalCountries.toLocaleString()} />
        </section>

        {/* Hotspot Map section */}
        <section className="mt-5 bg-white rounded-lg p-5">
          <h2 className="font-medium text-base pb-4 m-0">Hotspot Map</h2>
          <a href="/coverage">
            <MiniCoverageMap zoomLevel={0.9} />
          </a>
        </section>

        {/* Makers section */}
        <section className="mt-5 bg-white rounded-lg p-5 pb-10">
          <h2 className="font-medium text-base pb-4 m-0">Makers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {makers.map((m) => {
              const dcBalanceObject = new Balance(
                m.balanceInfo.dcBalance.integerBalance,
                CurrencyType.dataCredit,
              )

              return (
                <Link href={`/accounts/${m.address}`}>
                  <a className="transition-colors border border-solid border-gray-200 rounded-md p-5 hover:bg-gray-100">
                    <p className="text-sm font-semibold m-0 text-black">
                      {m.name}
                    </p>
                    <p className="text-sm font-light m-0 text-gray-600">
                      {m.address.slice(0, 5)}...{m.address.slice(-5)}
                    </p>
                    <p className="text-base pt-2.5 font-semibold m-0 text-gray-600">
                      {/* {JSON.stringify(m.balanceInfo)} */}
                      {dcBalanceObject.toString()}
                      {console.log(m.balanceInfo)}
                    </p>
                  </a>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Latest hotspots section */}
        <section className="mt-5 bg-white rounded-lg py-5">
          <h2 className="font-medium text-base pl-6 pb-4 m-0">
            Latest Hotspots
          </h2>
          <LatestHotspotsTable hotspots={latestHotspots} />
        </section>
      </div>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const client = new Client()
  const stats = await fetchStats()
  const hotspots = await (await client.hotspots.list()).take(100000)

  const now = new Date()

  const hotspotGrowth = [
    {
      time: getUnixTime(now),
      count: stats.totalHotspots,
    },
  ]

  const makersResponse = await fetch(
    `https://onboarding.dewi.org/api/v2/makers`,
  )
  const makersData = await makersResponse.json()
  const makers = makersData.data

  await Promise.all(
    makers.map(async (maker) => {
      const makerInfo = await client.accounts.get(maker.address)
      maker.balanceInfo = JSON.parse(JSON.stringify(makerInfo))
      return maker
    }),
  )

  Array.from({ length: 39 }, (x, i) => {
    const date = sub(now, { weeks: i + 1 })
    // count hotspots where the time added is earlier than the given date
    const count = countBy(
      hotspots,
      (h) => compareAsc(new Date(h.timestampAdded), date) === -1,
    ).true

    hotspotGrowth.unshift({
      time: getUnixTime(date),
      count,
    })
  })

  const onlineHotspotCount = countBy(
    hotspots,
    (h) => h.status.online === 'online',
  ).true

  const latestHotspots = JSON.parse(JSON.stringify(hotspots.slice(0, 20)))

  return {
    props: {
      hotspotGrowth,
      onlineHotspotCount,
      latestHotspots,
      stats,
      makers,
    },
    revalidate: 60,
  }
}

export default Hotspots
