import React from 'react'
import dynamic from 'next/dynamic'
import { countBy } from 'lodash'
import AppLayout from '../../components/AppLayout'
import { fetchLatestBeacons, useLatestBeacons } from '../../data/beacons'
import BeaconsTable from '../../components/Beacons/BeaconsTable'
import BeaconBarChart from '../../components/Beacons/BeaconBarChart'

const BeaconMap = dynamic(() => import('../../components/Beacons/BeaconMap'), {
  ssr: false,
  loading: () => <div className="h-80 md:h-96" />,
})

const Beacons = ({ latestBeacons: initialLatestBeacons }) => {
  const { latestBeacons } = useLatestBeacons(initialLatestBeacons, 1000)

  const txnCounts = countBy(latestBeacons, 'height')
  const chartData = Object.keys(txnCounts).map((height) => ({
    height,
    transactionCount: txnCounts[height],
  }))

  return (
    <AppLayout>
      <div
        className="flex flex-wrap lg:flex-row-reverse"
        style={{
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <div className="w-full lg:w-1/2">
          <BeaconMap beacon={latestBeacons ? latestBeacons[0] : undefined} />
        </div>
        <div className="bg-navy-500 w-full lg:w-1/2 lg:p-8">
          <div className="py-8 px-6 lg:px-0">
            <h1 className="text-white">Latest Beacons</h1>
          </div>
          <div>
            <div className="bg-navy-900 px-4 py-4 lg:rounded-t-xl">
              <h2 className="text-white m-0">Beacons per Block</h2>
              <BeaconBarChart data={chartData} />
            </div>
            <div className="bg-white lg:max-h-80 lg:overflow-y-scroll lg:rounded-b-xl">
              <BeaconsTable beacons={latestBeacons} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const latestBeacons = await fetchLatestBeacons(1000)()

  return {
    props: {
      latestBeacons,
    },
    revalidate: 10,
  }
}

export default Beacons
