import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import { h3Distance, h3GetResolution, h3ToChildren, h3ToParent } from 'h3-js'
import { Table, Tooltip } from 'antd'
import { formatDistance, formatWitnessInvalidReason } from '../Hotspots/utils'

// these values are from this table: https://h3geo.org/docs/core-library/restable
const AVG_H3_HEX_EDGE_LENGTHS_IN_KM = [
  // 0
  1107.712591,
  // 1
  418.6760055,
  // 2
  158.2446558,
  // 3
  59.81085794,
  // 4
  22.6063794,
  // 5
  8.544408276,
  // 6
  3.229482772,
  // 7
  1.220629759,
  // 8
  0.461354684,
  // 9
  0.174375668,
  // 10
  0.065907807,
  // 11
  0.024910561,
  // 12
  0.009415526,
  // 13
  0.003559893,
  // 14
  0.001348575,
  // 15
  0.000509713,
]

const PoCTableHeader = ({ tooltipText, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <p className="poc-witness-info-header">{title}</p>
      <Tooltip title={tooltipText}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{
            color: '#888',
            height: 18,
            width: 18,
            marginLeft: 5,
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
    </div>
  )
}

const PocInfoTable = ({
  participant,
  witness,
  witnessIndex,
  participantIndex,
  pocH3CellResolution,
}) => {
  let pLocation = participant.challengeeLocation
    ? participant.challengeeLocation
    : participant.challengee_location
    ? participant.challengee_location
    : ''

  let wLocation = witness.location

  // convert witness h3 location and challenge participant h3 location to the correct h3 resolution as set by the poc_v4_parent_res chain var
  if (pocH3CellResolution < h3GetResolution(pLocation)) {
    // if the chain var is higher than what's returned, get the h3 parent
    pLocation = h3ToParent(pLocation, pocH3CellResolution)
    wLocation = h3ToParent(wLocation, pocH3CellResolution)
  } else if (pocH3CellResolution > h3GetResolution(pLocation)) {
    // if the chain var is lower than what's returned, get the h3 child
    pLocation = h3ToChildren(pLocation, pocH3CellResolution)
    wLocation = h3ToChildren(wLocation, pocH3CellResolution)
  }

  const witnessDistInH3Cells = h3Distance(pLocation, wLocation)

  // for a rough approximation of distance, we can assume the diameter of 1 hexagon is roughly equal to (the average edge length of a hexagon at the given resolution) * 2
  const averageCellDiameter =
    AVG_H3_HEX_EDGE_LENGTHS_IN_KM[pocH3CellResolution] * 2

  const witnessDistInKm = averageCellDiameter * witnessDistInH3Cells

  const columns = []

  let columnCount = 2 // because RSSI and distance should always be there
  const snrIncluded = witness.snr
  const dataRateIncluded =
    witness.datarate !== undefined &&
    ((Array.isArray(witness.datarate) && witness.datarate.length > 0) ||
      (!Array.isArray(witness.datarate) && witness.datarate !== null))

  if (snrIncluded) columnCount++
  if (dataRateIncluded) columnCount++

  const columnWidth = `${(1 / columnCount) * 100}%`

  const rssiColumn = {
    title: (
      <PoCTableHeader
        title="RSSI"
        tooltipText={
          'RSSI stands for Received Signal Strength Indicator, and it represents the strength of the signal'
        }
      />
    ),
    dataIndex: 'rssi',
    width: columnWidth,
  }
  const snrColumn = snrIncluded
    ? {
        title: (
          <PoCTableHeader
            title="SNR"
            tooltipText={
              'SNR stands for Signal-to-Noise Ratio, and it represents the quality of the signal'
            }
          />
        ),
        dataIndex: 'snr',
        width: columnWidth,
      }
    : null
  const distanceColumn = {
    title: (
      <PoCTableHeader
        title="Distance"
        tooltipText={`This value is an approximation of the distance between the hotspot that witnessed the challenge and the one that participated in it. Helium uses hexagons from the H3 library, so this distance is a rough approximation based on how many resolution 12 H3 cells the two hotspots are apart. E.g. if it says the distance is 0, it's because they are in the same cell.`}
      />
    ),
    dataIndex: 'distance',
    width: columnWidth,
  }
  const dataRateColumn = dataRateIncluded
    ? {
        title: (
          <PoCTableHeader
            title="Data rate"
            tooltipText={`The data rate at which the signal was received.`}
          />
        ),
        dataIndex: 'datarate',
        width: columnWidth,
      }
    : null

  columns.push(rssiColumn)
  if (snrIncluded) columns.push(snrColumn)
  columns.push(distanceColumn)
  if (dataRateIncluded) columns.push(dataRateColumn)

  const data = [
    {
      key: '1',
      rssi: (
        <span
          style={
            !witness.isValid && witness?.invalidReason?.includes('rssi')
              ? { color: '#CA0926' }
              : {}
          }
        >{`${witness.signal}dBm`}</span>
      ),
      snr: `${witness.snr?.toFixed(2)}dB`,
      distance: (
        <span
          style={
            !witness.isValid && witness?.invalidReason === 'witness_too_close'
              ? { color: '#CA0926' }
              : {}
          }
        >
          {formatDistance(witnessDistInKm * 1000)}
        </span>
      ),
      datarate:
        witness.datarate !== undefined &&
        ((Array.isArray(witness.datarate) && witness.datarate.length > 0) ||
          (!Array.isArray(witness.datarate) && witness.datarate !== null)) &&
        (Array.isArray(witness.datarate)
          ? `${
              witness.datarate.length > 0
                ? `${String.fromCharCode.apply(null, witness.datarate)}`
                : ``
            } `
          : `${witness.datarate !== null && `${witness.datarate} `}`),
    },
  ]

  return (
    <div
      key={`${participantIndex}-${witnessIndex}`}
      style={witnessIndex !== 0 ? { paddingTop: 16 } : {}}
    >
      <span>
        <Link href={'/hotspots/' + witness.gateway}>
          <a className="poc-witness-name">{animalHash(witness.gateway)}</a>
        </Link>
        <span
          style={{
            color: witness.is_valid || witness.isValid ? '#F1C40F' : 'grey',
            paddingLeft: 10,
          }}
        >
          {witness.is_valid || witness.isValid
            ? 'Valid witness'
            : `Invalid witness${
                witness.invalidReason !== undefined
                  ? ` — (${formatWitnessInvalidReason(witness.invalidReason)})`
                  : ''
              }`}
        </span>
        <span className="poc-witness-info-table-container">
          <Table
            style={{ padding: '20px 0' }}
            pagination={{
              hideOnSinglePage: true,
            }}
            columns={columns}
            dataSource={data}
          />
        </span>
      </span>
    </div>
  )
}

export default PocInfoTable
