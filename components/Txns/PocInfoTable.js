import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import { h3Distance } from 'h3-js'
import { Table, Tooltip } from 'antd'

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
  h3exclusionCells,
  h3maxHopCells,
}) => {
  const pDistance = participant.challengeeLocation
    ? participant.challengeeLocation
    : participant.challengee_location
    ? participant.challengee_location
    : ''

  const witnessDistInH3Res12Cells = h3Distance(pDistance, witness.location)

  // We can assume the diameter of 1 hexagon is roughly equal to its edge length * 2
  // The average edge length of a resolution-12 hexagon in h3 is given in km here: https://h3geo.org/docs/core-library/restable
  const avgRes12HexEdgeLengthInKm = 0.009415526
  const avgRes12HexDiameterInKm = avgRes12HexEdgeLengthInKm * 2

  const witnessDistInKm = avgRes12HexDiameterInKm * witnessDistInH3Res12Cells

  const h3DistanceMinValid = h3exclusionCells <= witnessDistInH3Res12Cells
  const h3DistanceMaxValid = witnessDistInH3Res12Cells < h3maxHopCells

  const h3DistanceIsValid = h3DistanceMinValid && h3DistanceMaxValid

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
      rssi: `${witness?.signal}dBm`,
      snr: `${witness.snr?.toFixed(2)}dB`,
      distance: (
        <span style={!h3DistanceIsValid ? { color: '#CA0926' } : {}}>
          {witnessDistInKm < 1
            ? `${(witnessDistInKm * 1000).toFixed(2)}m`
            : `${witnessDistInKm.toFixed(2)}km`}
          {!h3DistanceIsValid &&
            (!h3DistanceMinValid
              ? ' (too close)'
              : !h3DistanceMaxValid
              ? ' (too far)'
              : '')}
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
        {/* <span>{witnessIndex + 1} — </span> */}
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
            ? '(Valid witness)'
            : '(Invalid witness)'}
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
