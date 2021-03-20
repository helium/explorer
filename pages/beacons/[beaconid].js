import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { sumBy, round } from 'lodash'
import Timestamp from 'react-timestamp'
import animalHash from 'angry-purple-tiger'
import AppLayout from '../../components/AppLayout'
import FlagLocation from '../../components/Common/FlagLocation'
import { fetchBeacon } from '../../data/beacons'
import { fetchHotspot } from '../../data/hotspots'
import WitnessesTable from '../../components/Beacons/WitnessesTable'
import RewardScalePill from '../../components/Hotspots/RewardScalePill'
import AccountLink from '../../components/Common/AccountLink'
import BeaconRow from '../../components/Beacons/BeaconRow'
import BeaconDetail from '../../components/Beacons/BeaconDetail'
import BeaconLabel from '../../components/Beacons/BeaconLabel'

const BeaconMap = dynamic(() => import('../../components/Beacons/BeaconMap'), {
  ssr: false,
  loading: () => <div className="h-80 md:h-96" />,
})

const Beacons = ({ beacon, challenger, challengee }) => {
  const totalWitnesses = sumBy(beacon?.path || [], 'witnesses.length')
  const paths = beacon?.path || []

  return (
    <AppLayout>
      <div
        className="flex flex-wrap lg:flex-row-reverse"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="w-full lg:w-1/2">
          <BeaconMap beacon={beacon} />
        </div>
        <div className="bg-navy-500 w-full lg:w-1/2 lg:p-20">
          <div className="p-6 lg:mb-8">
            <Link href="/beacons">
              <a>Latest Beacons</a>
            </Link>
            <h1 className="text-white text-3xl">Beacon</h1>
            <BeaconDetail icon="/images/block-mini.svg">
              <Link prefetch={false} href={`/blocks/${beacon.height}`}>
                <a className="text-gray-700">
                  Block{' '}
                  <span className="text-purple-500">
                    {beacon.height.toLocaleString()}
                  </span>
                </a>
              </Link>
            </BeaconDetail>
            <BeaconDetail icon="/images/time-mini.svg">
              <Timestamp date={beacon.time} />
            </BeaconDetail>
            <BeaconDetail icon="/images/witness-mini.svg">
              <span className="text-yellow-500">
                {totalWitnesses} Witnesses
              </span>
            </BeaconDetail>
          </div>

          <div>
            <div className="bg-navy-900 p-4 lg:rounded-t-xl">
              <div className="text-gray-700">CHALLENGER</div>
              <div className="flex w-full">
                <Link prefetch={false} href={`/hotspots/${challenger.address}`}>
                  <a className="text-white flex-auto">
                    {animalHash(challenger.address)}
                  </a>
                </Link>
                <span className="text-gray-700">
                  <FlagLocation geocode={challenger.geocode} />
                </span>
              </div>
            </div>

            <div
              className="bg-white p-4  lg:overflow-y-scroll lg:rounded-b-xl"
              style={{ overflowY: 'overlay' }}
            >
              {paths.map((path) => (
                <div>
                  <div className="border-b">
                    <img src="/images/beaconer.svg" alt="" className="mb-2" />
                    <BeaconRow>
                      <BeaconLabel>BEACONER</BeaconLabel>
                      <BeaconLabel>LOCATION</BeaconLabel>
                    </BeaconRow>
                    <BeaconRow>
                      <Link
                        prefetch={false}
                        href={`/hotspots/${path.challengee}`}
                      >
                        <a className="text-gray-700">
                          {animalHash(path.challengee)}
                        </a>
                      </Link>
                      <span className="text-gray-700">
                        <FlagLocation geocode={path.geocode} />
                      </span>
                    </BeaconRow>
                    {challengee.rewardScale && (
                      <div className="py-2 flex content-center">
                        <RewardScalePill
                          className="light-reward-pill flex content-center"
                          hotspot={challengee}
                        />
                        <div className="flex justify-center">
                          <AccountLink address={path.challengeeOwner} />
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="my-6 border-gray-350" />
                  <div>
                    <div className="mb-2">
                      <img src="/images/witness.svg" />
                    </div>
                    <WitnessesTable path={path} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params: { beaconid } }) {
  const beacon = await fetchBeacon(beaconid)
  const challenger = await fetchHotspot(beacon.challenger)
  const challengee = await fetchHotspot(beacon.path[0].challengee)
  return {
    props: {
      beacon,
      challenger,
      challengee,
    },
  }
}

export default Beacons
