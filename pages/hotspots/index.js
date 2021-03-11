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

const MiniCoverageMap = dynamic(
  () => import('../../components/CoverageMap/MiniCoverageMap'),
  {
    ssr: false,
    loading: () => <div style={{ height: '500px' }} />,
  },
)

const DEPRECATED_HELIUM_MAKER_ADDR =
  '14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh'

const MAKER_INTEGRATION_TEST_ADDR =
  '138LbePH4r7hWPuTnK6HXVJ8ATM2QU71iVHzLTup1UbnPDvbxmr'

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
                            title="This Maker address used genesis Data Credits to onboard Hotspots and is no longer in use. Read the blog for more details."
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="text-gray-500"
                              style={{
                                height: 18,
                                width: 18,
                                marginLeft: 6,
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm font-light m-0 text-gray-600">
                        {m.address.slice(0, 5)}...{m.address.slice(-5)}
                      </p>
                      <div className="pt-2.5 flex flex-row items-center justify-start">
                        <svg
                          width="53"
                          height="51"
                          viewBox="0 0 53 51"
                          fill="none"
                          className="h-3 w-auto mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.5664 25.1755C11.5664 19.4664 7.43021 14.7235 1.991 13.7798C0.902689 13.591 0 12.7136 0 11.6091V2.0004C0 0.895827 0.898592 -0.00787772 1.99977 0.0786605C14.9687 1.09785 25.1751 11.9448 25.1751 25.1755C25.1751 38.4062 14.9687 49.2531 1.99977 50.2723C0.898591 50.3589 0 49.4552 0 48.3506V38.7419C0 37.6374 0.902689 36.76 1.991 36.5712C7.43021 35.6275 11.5664 30.8845 11.5664 25.1755Z"
                            fill="#474DFF"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M40.5545 25.1751C40.5545 30.8841 44.6907 35.6271 50.1299 36.5708C51.2182 36.7596 52.1209 37.637 52.1209 38.7415L52.1209 48.3502C52.1209 49.4548 51.2223 50.3585 50.1211 50.2719C37.1522 49.2527 26.9458 38.4058 26.9458 25.1751C26.9458 11.9444 37.1522 1.09745 50.1211 0.0782622C51.2223 -0.00827797 52.1209 0.895428 52.1209 2L52.1209 11.6087C52.1209 12.7132 51.2182 13.5906 50.1299 13.7794C44.6907 14.7231 40.5545 19.466 40.5545 25.1751Z"
                            fill="#20DEB0"
                          />
                        </svg>
                        <p className="text-base font-semibold m-0 text-black">
                          {dcBalanceObject.toString()}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-b-lg p-5 pt-4 bg-gray-100">
                      <div className="flex flex-row items-center justify-start">
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-green-500 w-3 h-auto"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.91309 0C2.70395 0 0.913086 1.79086 0.913086 4V15.9553C0.913086 18.1644 2.70394 19.9553 4.91308 19.9553H16.8684C19.0775 19.9553 20.8684 18.1644 20.8684 15.9553V4C20.8684 1.79086 19.0775 0 16.8684 0H4.91309ZM10.8907 17.5822C15.0906 17.5822 18.4953 14.1775 18.4953 9.97763C18.4953 5.77773 15.0906 2.37305 10.8907 2.37305C6.69082 2.37305 3.28613 5.77773 3.28613 9.97763C3.28613 14.1775 6.69082 17.5822 10.8907 17.5822Z"
                            fill="#474DFF"
                          />
                        </svg>
                        <p className="text-sm ml-1 font-semibold m-0 text-gray-700">
                          {m.txns.addGatewayTxns.toLocaleString()}
                          <span className="ml-1 font-light text-gray-600">
                            Hotspots Added
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-start">
                        <svg
                          width="26"
                          height="31"
                          className="text-pink-500 w-3 h-auto"
                          viewBox="0 0 26 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M21.561 4.59665C26.4024 9.58151 26.4024 17.6636 21.561 22.6484L14.8179 29.5914C13.7007 30.7418 11.8893 30.7418 10.7721 29.5914L4.02896 22.6484C-0.812387 17.6636 -0.812387 9.58151 4.02896 4.59665C8.8703 -0.388214 16.7197 -0.388214 21.561 4.59665ZM12.7955 19.9476C16.3603 19.9476 19.2501 16.9728 19.2501 13.3032C19.2501 9.63353 16.3603 6.65869 12.7955 6.65869C9.23066 6.65869 6.34082 9.63353 6.34082 13.3032C6.34082 16.9728 9.23066 19.9476 12.7955 19.9476Z"
                            fill="currentColor"
                          />
                        </svg>

                        <p className="text-sm ml-1 font-semibold m-0 text-gray-700">
                          {m.txns.assertLocationTxns.toLocaleString()}
                          <span className="ml-1 font-light text-gray-600">
                            Hotspots Asserted
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
                        <p className="text-sm pt-2.5 m-0 font-medium text-gray-600">
                          Adds + Asserts Left:{' '}
                          <span className="text-gray-700 font-semibold">
                            {addsPlusAssertsLeft.toLocaleString()}
                          </span>
                        </p>
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

  const makersResponse = await fetch(
    `https://onboarding.dewi.org/api/v2/makers`,
  )
  const makersData = await makersResponse.json()
  const makersArray = makersData.data

  // Add old Helium maker address
  const deprecatedHeliumMaker = {
    address: DEPRECATED_HELIUM_MAKER_ADDR,
    name: 'Helium Inc (Old)',
    genesisHotspots: 47,
  }
  makersArray.unshift(deprecatedHeliumMaker)

  // Hide maker integration test address
  const makers = makersArray.filter(
    (m) => m.address !== MAKER_INTEGRATION_TEST_ADDR,
  )

  await Promise.all(
    makers.map(async (maker) => {
      const makerInfo = await client.accounts.get(maker.address)
      maker.balanceInfo = JSON.parse(JSON.stringify(makerInfo))

      const MAX_TXNS = 50000

      const addGatewayTxnsList = await client
        .account(maker.address)
        .activity.list({
          filterTypes: ['add_gateway_v1'],
        })
      const assertLocationTxnsList = await client
        .account(maker.address)
        .activity.list({
          filterTypes: ['assert_location_v1'],
        })

      const addGatewayTxns = await addGatewayTxnsList.take(MAX_TXNS)
      const assertLocationTxns = await assertLocationTxnsList.take(MAX_TXNS)

      const makerTxns = {
        addGatewayTxns: addGatewayTxns.length,
        assertLocationTxns: assertLocationTxns.length,
      }
      maker.txns = JSON.parse(JSON.stringify(makerTxns))

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
