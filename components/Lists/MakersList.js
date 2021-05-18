import Link from 'next/link'
import { Balance, CurrencyType } from '@helium/currency'
import DCIcon from '../Icons/DC'
import HotspotSimpleIcon from '../Icons/HotspotSimple'
import BurnIcon from '../Icons/BurnIcon'
import LocationIcon from '../Icons/Location'
import InfoIcon from '../Icons/Info'
import InternalLink from '../Icons/InternalLink'
import {
  DEPRECATED_HELIUM_MAKER_ADDR,
  DEPRECATED_HELIUM_BURN_ADDR,
} from '../../data/makers'
import { Tooltip } from 'antd'
import classNames from 'classnames'

const MakersList = ({ makers }) => {
  const oldHeliumBurnAddrData = makers.find(
    (m) => m.address === DEPRECATED_HELIUM_BURN_ADDR,
  )
  return (
    <div className={classNames('w-full grid grid-cols-1')}>
      {makers.map((m, i) => {
        const dcBalanceObject = new Balance(
          m.balanceInfo.dcBalance.integerBalance,
          CurrencyType.dataCredit,
        )
        const addsPlusAssertsLeft = Math.floor(
          m.balanceInfo.dcBalance.integerBalance / 5000000,
        )

        const hntBurnedAmountInBones =
          m.address === DEPRECATED_HELIUM_MAKER_ADDR
            ? // for the "Helium Inc (Old)" maker account, use the account data of the one where the burns happened instead
              oldHeliumBurnAddrData.txns.tokenBurnAmountInBones
            : m.txns.tokenBurnAmountInBones
        const hntBurned = new Balance(
          hntBurnedAmountInBones,
          CurrencyType.networkToken,
        )

        if (m.address !== DEPRECATED_HELIUM_BURN_ADDR)
          return (
            <div className="border border-solid border-gray-300 rounded-lg shadow-sm bg-white hover:bg-white">
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
                        <InfoIcon className="text-gray-600 h-4 w-4" />
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
              <div className="rounded-b-lg p-5 pt-4 bg-gray-100 border-t border-r-0 border-b-0 border-l-0 border-gray-300 border-solid flex flex-col space-y-2">
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
                <div className="flex flex-row items-center justify-start">
                  <BurnIcon className="text-orange-300 w-3 h-auto" />
                  <p className="text-sm ml-1 font-semibold m-0 text-gray-700">
                    {hntBurned.toString(2).slice(0, -4)}
                    <span className="ml-1 font-light text-gray-600">
                      HNT burned
                    </span>
                  </p>
                  {m.address === DEPRECATED_HELIUM_MAKER_ADDR && (
                    <Tooltip
                      placement="top"
                      title={`The number represented here was burned by the wallet with the address: ${DEPRECATED_HELIUM_BURN_ADDR}.`}
                    >
                      <span className="ml-2 flex flex-row items-center justify-center">
                        <InfoIcon className="text-gray-600 h-4 w-4" />
                      </span>
                    </Tooltip>
                  )}
                </div>
                {m.address === DEPRECATED_HELIUM_MAKER_ADDR ? (
                  <p className="text-sm pt-2.5 m-0 font-medium text-gray-600">
                    Genesis Hotspots:{' '}
                    <span className="text-gray-700">{m.genesisHotspots}</span>
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
                        <InfoIcon className="text-gray-600 h-4 w-4" />
                      </span>
                    </Tooltip>
                  </div>
                )}
                <div className="">
                  <Link href={`/accounts/${m.address}`}>
                    <a className="px-4 py-2 text-gray-700 font-medium bg-white mt-4 shadow-md transition-all hover:shadow-lg rounded-lg flex flex-row justify-between items-center">
                      View account
                      <InternalLink className="h-4 w-auto text-gray-600" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )
      })}
    </div>
  )
}

export default MakersList
