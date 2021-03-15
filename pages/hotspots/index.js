import React from 'react'
import Client from '@helium/http'
import countBy from 'lodash/countBy'
import AppLayout from '../../components/AppLayout'
import { Tooltip } from 'antd'
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
import DCIcon from '../../components/Icons/DC'
import HotspotSimpleIcon from '../../components/Icons/HotspotSimple'
import LocationIcon from '../../components/Icons/Location'
import InfoIcon from '../../components/Icons/Info'
import {
  DEPRECATED_HELIUM_MAKER_ADDR,
  getMakersData,
} from '../../components/Makers/utils'

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
}) => {
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
      <div className="max-w-screen-xl mx-auto px-2 sm:px-10 pt-5 pb-24">
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
            {makers.map((m, i) => {
              const dcBalanceObject = new Balance(
                m.balanceInfo.dcBalance.integerBalance,
                CurrencyType.dataCredit,
              )
              const addsPlusAssertsLeft = Math.floor(
                m.balanceInfo.dcBalance.integerBalance / 5000000,
              )

              return (
                <Link href={`/accounts/${m.address}`}>
                  <a className="transition-all border border-solid border-gray-300 rounded-lg hover:shadow-xl bg-white hover:bg-white">
                    <div className="p-5 pb-4">
                      <div className="flex flex-row items-center justify-start">
                        <p className="text-sm font-semibold m-0 text-black">
                          {m.name}
                        </p>
                        {m.address === DEPRECATED_HELIUM_MAKER_ADDR && (
                          <Tooltip
                            placement="top"
                            title="This Maker address used genesis Data Credits to onboard Hotspots and is no longer in use."
                          >
                            <span className="ml-2 flex flex-row items-center justify-center">
                              <InfoIcon className="text-gray-500 h-4 w-4" />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm font-light m-0 text-gray-600">
                        {m.address.slice(0, 5)}...{m.address.slice(-5)}
                      </p>
                      <div className="pt-2.5 flex flex-row items-center justify-start">
                        <DCIcon className="h-3 w-auto mr-2" />
                        <p className="text-base font-semibold m-0 text-black">
                          {dcBalanceObject.toString()}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-b-lg p-5 pt-4 bg-gray-100">
                      <div className="flex flex-row items-center justify-start">
                        <HotspotSimpleIcon className="text-green-500 w-3 h-auto" />
                        <p className="text-sm ml-1 font-semibold m-0 text-gray-700">
                          {m.txns.addGatewayTxns.toLocaleString()}
                          <span className="ml-1 font-light text-gray-600">
                            Hotspots Added
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-start">
                        <LocationIcon className="text-pink-500 w-3 h-auto" />
                        <p className="text-sm ml-1 font-semibold m-0 text-gray-700">
                          {m.txns.assertLocationTxns.toLocaleString()}
                          <span className="ml-1 font-light text-gray-600">
                            Locations Asserted
                          </span>
                        </p>
                      </div>
                      {m.address === DEPRECATED_HELIUM_MAKER_ADDR ? (
                        <p className="text-sm pt-2.5 m-0 font-medium text-gray-600">
                          Genesis Hotspots:{' '}
                          <span className="text-gray-700">
                            {m.genesisHotspots}
                          </span>
                        </p>
                      ) : (
                        <div className="flex flex-row items-center justify-start pt-2.5">
                          <p className="text-sm m-0 font-light text-gray-600">
                            Adds + Asserts Left:{' '}
                            <span className="text-gray-700 font-semibold">
                              {addsPlusAssertsLeft.toLocaleString()}
                            </span>
                          </p>
                          <Tooltip
                            placement="top"
                            title={`The number of hotspots this Maker could afford to onboard given their current DC balance, assuming a cost of ${(5000000).toLocaleString()} DC for each hotspot (${(4000000).toLocaleString()} DC to add it to the blockchain, and ${(1000000).toLocaleString()} DC to assert its location).`}
                          >
                            <span className="ml-2 flex flex-row items-center justify-center">
                              <InfoIcon className="text-gray-500 h-4 w-4" />
                            </span>
                          </Tooltip>
                        </div>
                      )}
                    </div>
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

  const makers = await getMakersData()

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
