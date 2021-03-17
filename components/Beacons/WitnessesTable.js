import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import { h3ToGeo } from 'h3-js'
import Pill from '../Common/Pill'
import { calculateDistance, formatDistance } from '../../utils/distance'
import AccountLink from '../Common/AccountLink'

const Label = ({ children }) => (
  <span className="text-gray-300 font-light text-xs tracking-wide">
    {children}
  </span>
)

const Th = ({ children, className }) => (
  <th className={classNames('px-1 py-1', className)}>
    <Label>{children}</Label>
  </th>
)

const Td = ({ children, className }) => (
  <td className={classNames('px-1 py-1', className)}>{children}</td>
)

const WitnessesTable = ({ path, highlightedAddress }) => {
  if (!path) return null

  const witnesses = path?.witnesses || []

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <Th className="text-left">{witnesses.length} WITNESSES</Th>
          <Th className="text-left">OWNED BY</Th>
          <Th className="text-left">SUCCESS</Th>
          <Th className="text-right">DISTANCE</Th>
        </tr>
      </thead>
      <tbody>
        {witnesses.map((witness) => {
          const [witnessLat, witnessLng] = h3ToGeo(witness.location)
          return (
            <tr
              className={`${
                witness.gateway === highlightedAddress
                  ? 'bg-gray-100 -mr-2 -ml-2'
                  : ''
              }`}
              key={witness.gateway}
            >
              <Td>
                <Link prefetch={false} href={`/hotspots/${witness.gateway}`}>
                  <a className="text-gray-400">{animalHash(witness.gateway)}</a>
                </Link>
              </Td>
              <Td>
                <AccountLink address={witness.owner} />
              </Td>
              <Td className="text-left">
                <Pill
                  title={witness.isValid ? 'VALID' : 'INVALID'}
                  color={witness.isValid ? 'green' : 'gray'}
                  tooltip={witness.invalidReason}
                />
              </Td>
              <Td className="text-right whitespace-nowrap">
                <span className="text-gray-400">
                  {path.challengeeLon &&
                    formatDistance(
                      calculateDistance(
                        [path.challengeeLon, path.challengeeLat],
                        [witnessLng, witnessLat],
                      ),
                    )}
                </span>
              </Td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default WitnessesTable
