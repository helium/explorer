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
  cities,
  topCities,
  topCitiesTotal,
}) => {
  const {
    stats: { totalHotspots, totalCities, totalCountries },
  } = useStats(initialStats)
  const { latestHotspots } = useLatestHotspots(initialLatestHotspots)

  const hotspotAddedInLastDay =
    hotspotGrowth[hotspotGrowth.length - 1].count -
    hotspotGrowth[hotspotGrowth.length - 2].count

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
      <div className="max-w-screen-xl mx-auto px-2 sm:px-3 md:px-4 lg:px-10 pt-5 pb-24">
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

        {/* Top cities section */}
        <section className="mt-5 bg-white rounded-lg py-5">
          <h2 className="font-medium text-base pl-6 pb-2 m-0">Top Cities</h2>
          <CitiesTable
            cities={cities}
            topCities={topCities}
            topCitiesTotal={topCitiesTotal}
          />
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

  const makers = await getMakersData()

  Array.from({ length: 364 }, (x, i) => {
    const date = sub(now, { days: i + 1 })
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

  const citiesRes = await fetch('https://api.helium.io/v1/cities?sort=hotspots')
  const { data: cities } = await citiesRes.json()

  const topCities = []
  hotspots.map((h) => {
    const isOnlineAndAsserted =
      h.status.online === 'online' &&
      h.location !== null &&
      h.geocode.cityId !== null
    if (isOnlineAndAsserted) {
      // see if another hotspot from this city has already been counted
      const cityIndex = topCities.findIndex((c) => c.id === h.geocode.cityId)
      if (cityIndex === -1) {
        // if it hasn't, create a new city in our topCities array
        const newCity = {
          id: h.geocode.cityId,
          shortCity: h.geocode.shortCity,
          longCity: h.geocode.longCity,
          shortState: h.geocode.shortState,
          longState: h.geocode.longState,
          shortCountry: h.geocode.shortCountry,
          longCountry: h.geocode.longCountry,
          hotspotCount: isOnlineAndAsserted ? 1 : 0,
        }
        topCities.push(newCity)
      } else {
        // if it has, increment that city's hotspotCount
        if (isOnlineAndAsserted) topCities[cityIndex].hotspotCount++
      }
    }
  })

  const topCitiesTotal = []
  hotspots.map((h) => {
    // see if another hotspot from this city has already been counted
    const cityIndexTotal = topCitiesTotal.findIndex(
      (c) => c.id === h.geocode.cityId,
    )
    if (cityIndexTotal === -1) {
      // if it hasn't, create a new city in our topCities array
      const newCity = {
        id: h.geocode.cityId,
        shortCity: h.geocode.shortCity,
        longCity: h.geocode.longCity,
        shortState: h.geocode.shortState,
        longState: h.geocode.longState,
        shortCountry: h.geocode.shortCountry,
        longCountry: h.geocode.longCountry,
        hotspotCount: 1,
      }
      topCitiesTotal.push(newCity)
    } else {
      // if it has, increment that city's hotspotCount
      if (h.location !== null) topCitiesTotal[cityIndexTotal].hotspotCount++
    }
  })

  return {
    props: {
      hotspotGrowth,
      onlineHotspotCount,
      latestHotspots,
      stats,
      makers,
      cities,
      topCities,
      topCitiesTotal,
    },
    revalidate: 60,
  }
}

export default Hotspots
