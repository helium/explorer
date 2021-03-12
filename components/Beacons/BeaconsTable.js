import React from 'react'
import classNames from 'classnames'
import TimeAgo from '../Common/TimeAgo'
import FlagLocation from '../Common/FlagLocation'
import Link from 'next/link'

const Label = ({ children }) => (
  <span className="text-gray-200 font-light text-sm tracking-wide">
    {children}
  </span>
)

const Th = ({ children, className }) => (
  <th className={classNames('sticky top-0 px-4 pt-4 pb-2 bg-white', className)}>
    <Label>{children}</Label>
  </th>
)

const Td = ({ children, className }) => (
  <td className={classNames('px-4 py-1', className)}>{children}</td>
)

const BeaconsTable = ({ beacons }) => {
  if (!beacons) return null

  return (
    <table className="table-auto w-full relative">
      <thead>
        <tr>
          <Th>LOCATION</Th>
          <Th className="text-right">WITNESSES</Th>
          <Th className="text-right">TIME</Th>
        </tr>
      </thead>
      <tbody>
        {beacons.map((beacon) => (
          <tr key={beacon.hash}>
            <Td>
              <Link prefetch={false} href={`/beacons/${beacon.hash}`}>
                <a className="text-gray-400">
                  <FlagLocation
                    geocode={beacon.path[0].geocode}
                    country="long"
                  />
                </a>
              </Link>
            </Td>
            <Td className="text-right">
              <span className="text-gray-400">
                {beacon.path[0].witnesses.length}
              </span>
            </Td>
            <Td className="text-right whitespace-nowrap">
              <span className="text-gray-400">
                <TimeAgo time={beacon.time} />
              </span>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BeaconsTable
