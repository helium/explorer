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

const BeaconMap = dynamic(() => import('../../components/Beacons/BeaconMap'), {
  ssr: false,
  loading: () => <div className="h-80 md:h-96" />,
})

const Label = ({ children }) => (
  <span className="text-gray-200 font-light text-sm tracking-wide">
    {children}
  </span>
)

const BeaconDetail = ({ icon, children }) => (
  <div className="mb-2 text-gray-400">
    <span className="w-5 inline-block">
      <img src={icon} alt="" />
    </span>
    {children}
  </div>
)

const Row = ({ children }) => (
  <div className="flex flex-row justify-between">{children}</div>
)

const Beacons = ({ beacon, challenger }) => {
  const totalWitnesses = sumBy(beacon?.path || [], 'witnesses.length')
  const paths = beacon?.path || []

  return (
    <AppLayout>
      <div className="flex flex-wrap lg:flex-row-reverse lg:h-screen">
        <div className="w-full lg:w-1/2">
          <BeaconMap beacon={beacon} />
        </div>
        <div className="bg-navy-500 w-full lg:w-1/2 lg:p-8">
          <div className="p-6 lg:mb-8">
            <Link href="/beacons">
              <a>Latest Beacons</a>
            </Link>
            <h1 className="text-white">Beacon</h1>
            <BeaconDetail icon="/images/block-mini.svg">
              <Link prefetch={false} href={`/blocks/${beacon.height}`}>
                <a className="text-gray-400">
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
              <div className="text-gray-400">CHALLENGER</div>
              <Row>
                <Link prefetch={false} href={`/hotspots/${challenger.address}`}>
                  <a className="text-white">{animalHash(challenger.address)}</a>
                </Link>
                <span className="text-gray-400">
                  <FlagLocation geocode={challenger.geocode} />
                </span>
              </Row>
            </div>

            <div className="bg-white p-4 lg:max-h-96 lg:overflow-y-scroll lg:rounded-b-xl">
              {paths.map((path) => (
                <div>
                  <div className="border-b">
                    <img src="/images/beaconer.svg" alt="" className="mb-2" />
                    <Row>
                      <Label>BEACONER</Label>
                      <Label>LOCATION</Label>
                    </Row>
                    <Row>
                      <Link
                        prefetch={false}
                        href={`/hotspots/${path.challengee}`}
                      >
                        <a className="text-gray-400">
                          {animalHash(path.challengee)}
                        </a>
                      </Link>
                      <span className="text-gray-400">
                        <FlagLocation geocode={path.geocode} />
                      </span>
                    </Row>
                    {challenger.rewardScale && (
                      <div className="py-2">
                        <RewardScalePill hotspot={challenger} />
                      </div>
                    )}
                  </div>
                  <hr className="my-6 border-gray-100" />
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

  return {
    props: {
      beacon,
      challenger,
    },
  }
}

export default Beacons
