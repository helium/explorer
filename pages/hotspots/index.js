import React from 'react'
import Client from '@helium/http'
import countBy from 'lodash/countBy'
import AppLayout from '../../components/AppLayout'
import HotspotChart from '../../components/Hotspots/HotspotChart'
import LatestHotspotsTable from '../../components/Hotspots/LatestHotspotsTable'
import CitiesTable from '../../components/Hotspots/CitiesTable'
import { fetchStats, useStats } from '../../data/stats'
import { sub, compareAsc, getUnixTime } from 'date-fns'
import { useLatestHotspots } from '../../data/hotspots'
import TopBanner from '../../components/AppLayout/TopBanner'
import TopChart from '../../components/AppLayout/TopChart'
import HotspotsImg from '../../public/images/hotspots.svg'
import Widget from '../../components/Home/Widget'
import dynamic from 'next/dynamic'
import MakersDashboard from '../../components/Makers/MakersDashboard'
import { getMakersData } from '../../components/Makers/utils.js'
import { fetchCitiesByOnline, fetchCitiesByTotal } from '../../data/stats'

const MiniCoverageMap = dynamic(
  () => import('../../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const Hotspots = ({
  hotspotGrowth,
  onlineHotspotCount,
  latestHotspots: initialLatestHotspots,
  stats: initialStats,
  makers,
  topCities,
  topCitiesTotal,
}) => {
  const {
    stats: { totalHotspots, totalCities, totalCountries },
  } = useStats(initialStats)
  const { latestHotspots } = useLatestHotspots(initialLatestHotspots)

  // const days = hotspotGrowth.length
  // const hotspotGrowth24Hours =
  //   hotspotGrowth[days - 1].count - hotspotGrowth[days - 2].count
  // const hotspotGrowth24HourPreviousPeriod =
  //   hotspotGrowth[days - 2].count - hotspotGrowth[days - 3].count

  // const hotspotGrowth30Days =
  //   hotspotGrowth[days - 1].count - hotspotGrowth[days - 31].count
  // const hotspotGrowth30DayPreviousPeriod =
  //   hotspotGrowth[days - 31].count - hotspotGrowth[days - 61].count

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
      {/* <TopChart
        title="Hotspot Network Growth"
        chart={<HotspotChart data={hotspotGrowth} />}
      /> */}
      <div className="max-w-screen-lg mx-auto px-2 sm:px-3 md:px-4 lg:px-10 pt-5 pb-24">
        {/* Stats section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
          <Widget
            title="Total Hotspots"
            value={totalHotspots.toLocaleString()}
            // change={
            //   ((totalHotspots - hotspotGrowth.slice(-11, -10)[0].count) /
            //     totalHotspots) *
            //   100
            // }
            // changeSuffix="%"
          />
          {/* <Widget
            title="Hotspots Online"
            value={onlineHotspotCount.toLocaleString()}
            change={(onlineHotspotCount / totalHotspots) * 100}
            changeSuffix="%"
            changeIsAmbivalent
          /> */}
          {/* <Widget
            title="Hotspots Added in Last 24 Hours"
            value={hotspotGrowth24Hours.toLocaleString()}
            change={
              ((hotspotGrowth24Hours - hotspotGrowth24HourPreviousPeriod) /
                hotspotGrowth24HourPreviousPeriod) *
              100
            }
            changeSuffix="%"
          />
          <Widget
            title="Hotspots Added in Last 30 Days"
            value={hotspotGrowth30Days.toLocaleString()}
            change={
              ((hotspotGrowth30Days - hotspotGrowth30DayPreviousPeriod) /
                hotspotGrowth30DayPreviousPeriod) *
              100
            }
            changeSuffix="%"
          /> */}
          <Widget title="Cities" value={totalCities.toLocaleString()} />
          <Widget title="Countries" value={totalCountries.toLocaleString()} />
        </section>

        {/* Hotspot Map section */}
        {/* <section className="mt-5 bg-white rounded-lg p-5">
          <h2 className="font-medium text-base pb-4 m-0">Hotspot Map</h2>
          <a href="/coverage">
            <MiniCoverageMap zoomLevel={0.9} />
          </a>
        </section> */}

        {/* Top cities section */}
        <section className="mt-5 bg-white rounded-lg py-5">
          <h2 className="font-medium text-base pl-6 pb-2 m-0">Top Cities</h2>
          <CitiesTable topCities={topCities} topCitiesTotal={topCitiesTotal} />
        </section>

        {/* Makers section */}
        <section className="mt-5 bg-white rounded-lg p-5 pb-10">
          <h2 className="font-medium text-base pb-4 m-0">Makers</h2>
          <MakersDashboard makers={makers} />
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
  // const client = new Client()
  const stats = await fetchStats()
  // const hotspots = [] // await (await client.hotspots.list()).take(100000)

  // const now = new Date()

  // const hotspotGrowth = [
  //   {
  //     time: getUnixTime(now),
  //     count: stats.totalHotspots,
  //   },
  // ]

  const makers = await getMakersData()

  // Array.from({ length: 364 }, (x, i) => {
  //   const date = sub(now, { days: i + 1 })
  //   // count hotspots where the time added is earlier than the given date
  //   const count = countBy(
  //     hotspots,
  //     (h) => compareAsc(new Date(h.timestampAdded), date) === -1,
  //   ).true

  //   hotspotGrowth.unshift({
  //     time: getUnixTime(date),
  //     count,
  //   })
  // })

  // const onlineHotspotCount = countBy(
  //   hotspots,
  //   (h) => h.status.online === 'online',
  // ).true

  // const latestHotspots = JSON.parse(JSON.stringify(hotspots.slice(0, 20)))

  const topCities = await fetchCitiesByOnline()
  const topCitiesTotal = await fetchCitiesByTotal()

  return {
    props: {
      hotspotGrowth: [],
      onlineHotspotCount: 0,
      latestHotspots: [],
      stats,
      makers,
      topCities,
      topCitiesTotal,
    },
    revalidate: 60,
  }
}

export default Hotspots
