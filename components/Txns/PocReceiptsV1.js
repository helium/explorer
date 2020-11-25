import React from 'react'
import { Descriptions, Collapse, Table, Tooltip } from 'antd'

import { h3Distance } from 'h3-js'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import PocPath from './PocPath'
const { Panel } = Collapse

const PoCTableHeader = ({ tooltipText, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <p style={{ padding: 0, margin: 0 }}>{title}</p>
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

const PocReceiptsV1 = ({ txn, h3exclusionCells, h3maxHopCells }) => (
  <div>
    <PocPath path={txn.path} />
    <Descriptions bordered>
      <Descriptions.Item label="Challenger" span={3}>
        <Link href={'/hotspots/' + txn.challenger}>
          <a>{animalHash(txn.challenger)}</a>
        </Link>
      </Descriptions.Item>
      <Descriptions.Item label="Block Height" span={3}>
        <Link href={'/blocks/' + txn.height}>
          <a>{txn.height}</a>
        </Link>
      </Descriptions.Item>
    </Descriptions>
    <Descriptions bordered layout="vertical">
      <Descriptions.Item label="PoC Path" span={3}>
        <ol style={{ margin: 0, padding: 0 }}>
          {txn.path.map((p, idx, { length }) => {
            return (
              <>
                <div key={`${p.receipt}-${idx}`}>
                  <div
                    style={{
                      marginBottom: '0px',
                      paddingTop: '24px',
                    }}
                  >
                    <div className="poc-participant-row">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          position: 'relative',
                        }}
                      >
                        {idx !== 0 && (
                          <span
                            className={`poc-path-line-above ${
                              txn.path[idx - 1].receipt &&
                              txn.path[idx - 1].receipt.origin === 'radio'
                                ? 'poc-path-line-above-2'
                                : ''
                            }`}
                            style={{
                              backgroundColor: `${
                                txn.path[idx - 1].receipt ||
                                txn.path[idx - 1].witnesses.length > 0 ||
                                p.receipt ||
                                p.witnesses.length > 0
                                  ? '#09B851'
                                  : '#CA0926'
                              }`,
                            }}
                          />
                        )}
                        <p
                          style={{
                            backgroundColor: `${
                              p.receipt ||
                              p.witnesses.length > 0 ||
                              (txn.path[idx + 1] &&
                                (txn.path[idx + 1].receipt ||
                                  txn.path[idx + 1].witnesses.length > 0))
                                ? '#09B851'
                                : '#CA0926'
                            }`,
                            color: 'white',
                            width: '40px',
                            minWidth: '40px',
                            height: '40px',
                            minHeight: '40px',
                            borderRadius: 22,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            marginBottom: 0,
                          }}
                        >
                          {idx + 1}
                        </p>
                        <Link href={'/hotspots/' + p.challengee}>
                          <a
                            style={{
                              paddingLeft: 10,
                              fontSize: 24,
                            }}
                          >
                            {animalHash(p.challengee)}
                          </a>
                        </Link>
                      </div>
                      {p.receipt && p.receipt.origin === 'radio' && (
                        <span className="poc-witness-receive-info" style={{}}>
                          {`— received at RSSI ${p.receipt.signal}dBm, SNR ${
                            p.receipt.snr ? `${p.receipt.snr.toFixed(2)}dB` : ''
                          }${
                            p.receipt !== null &&
                            p.receipt.datarate !== undefined
                              ? Array.isArray(p.receipt.datarate)
                                ? `${
                                    p.receipt.datarate.length > 0
                                      ? `, ${String.fromCharCode.apply(
                                          null,
                                          p.receipt.datarate,
                                        )}`
                                      : ``
                                  }`
                                : `${
                                    p.receipt.datarate !== null &&
                                    `, ${p.receipt.datarate} `
                                  }`
                              : ``
                          }`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexFlow: 'row',
                      alignItems: 'stretch',
                      position: 'relative',
                    }}
                  >
                    {idx !== length - 1 && (
                      <span
                        className={`poc-path-line ${
                          p.receipt && p.receipt.origin === 'radio'
                            ? 'poc-path-line-with-info'
                            : ''
                        }`}
                        style={{
                          backgroundColor: `${
                            p.receipt ||
                            p.witnesses.length > 0 ||
                            (txn.path[idx + 1] &&
                              (txn.path[idx + 1].receipt ||
                                txn.path[idx + 1].witnesses.length > 0))
                              ? '#09B851'
                              : '#CA0926'
                          }`,
                        }}
                      />
                    )}
                    <div
                      className="poc-witness-table-container"
                      style={{ flex: '1' }}
                    >
                      {p.witnesses.length > 0 && (
                        <>
                          <Collapse
                            defaultActiveKey={[idx]}
                            className="poc-witness-collapsable-panel"
                          >
                            <Panel
                              header={`${p.witnesses.length} witnesses`}
                              key={idx}
                            >
                              <div className="poc-witness-table">
                                {p.witnesses.map((w, i) => {
                                  const witnessDistInH3Res12Cells = h3Distance(
                                    p.challengee_location,
                                    w.location,
                                  )

                                  // We can assume the diameter of 1 hexagon is roughly equal to its edge length * 2
                                  // The average edge length of a resolution-12 hexagon in h3 is given in km here: https://h3geo.org/docs/core-library/restable
                                  const avgRes12HexEdgeLengthInKm = 0.009415526
                                  const avgRes12HexDiameterInKm =
                                    avgRes12HexEdgeLengthInKm * 2

                                  const witnessDistInKm =
                                    avgRes12HexDiameterInKm *
                                    witnessDistInH3Res12Cells

                                  // console.log(
                                  //   `Witness distance in km: ~${witnessDistInKm}`,
                                  // )

                                  const h3DistanceMinValid =
                                    h3exclusionCells <=
                                    witnessDistInH3Res12Cells
                                  const h3DistanceMaxValid =
                                    witnessDistInH3Res12Cells < h3maxHopCells

                                  const h3DistanceIsValid =
                                    h3DistanceMinValid && h3DistanceMaxValid

                                  const columns =
                                    w.datarate !== undefined &&
                                    ((Array.isArray(w.datarate) &&
                                      w.datarate.length > 0) ||
                                      (!Array.isArray(w.datarate) &&
                                        w.datarate !== null))
                                      ? [
                                          {
                                            title: (
                                              <PoCTableHeader
                                                title="RSSI"
                                                tooltipText={
                                                  'RSSI stands for Received Signal Strength Indicator, and it represents the strength of the signal'
                                                }
                                              />
                                            ),
                                            dataIndex: 'rssi',
                                          },
                                          {
                                            title: (
                                              <PoCTableHeader
                                                title="SNR"
                                                tooltipText={
                                                  'SNR stands for Signal-to-Noise Ratio, and it represents the quality of the signal'
                                                }
                                              />
                                            ),
                                            dataIndex: 'snr',
                                          },
                                          {
                                            title: (
                                              <PoCTableHeader
                                                title="Distance"
                                                tooltipText={`This value is an approximation of the distance between the hotspot that witnessed the challenge and the one that participated in it. Helium uses hexagons from the H3 library, so this distance is a rough approximation based on how many resolution 12 H3 cells the two hotspots are apart. E.g. if it says the distance is 0, it's because they are in the same cell.`}
                                              />
                                            ),
                                            dataIndex: 'distance',
                                          },
                                          {
                                            title: (
                                              <PoCTableHeader
                                                title="Data rate"
                                                tooltipText={`The data rate at which the signal was received.`}
                                              />
                                            ),
                                            dataIndex: 'datarate',
                                          },
                                        ]
                                      : [
                                          {
                                            title: 'RSSI',
                                            dataIndex: 'rssi',
                                          },
                                          {
                                            title: 'SNR',
                                            dataIndex: 'snr',
                                          },
                                          {
                                            title: 'Distance',
                                            dataIndex: 'distance',
                                          },
                                        ]
                                  const data = [
                                    {
                                      key: '1',
                                      rssi: `${w.signal}dBm`,
                                      snr: `${w.snr.toFixed(2)}dB`,
                                      distance: (
                                        <span
                                          style={
                                            !h3DistanceIsValid
                                              ? { color: '#CA0926' }
                                              : {}
                                          }
                                        >
                                          {witnessDistInKm < 1
                                            ? `${(
                                                witnessDistInKm * 1000
                                              ).toFixed(2)}m`
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
                                        w.datarate !== undefined &&
                                        ((Array.isArray(w.datarate) &&
                                          w.datarate.length > 0) ||
                                          (!Array.isArray(w.datarate) &&
                                            w.datarate !== null)) &&
                                        (Array.isArray(w.datarate)
                                          ? `${
                                              w.datarate.length > 0
                                                ? `${String.fromCharCode.apply(
                                                    null,
                                                    w.datarate,
                                                  )}`
                                                : ``
                                            } `
                                          : `${
                                              w.datarate !== null &&
                                              `${w.datarate} `
                                            }`),
                                    },
                                  ]

                                  return (
                                    <div
                                      key={`${idx}-${i}`}
                                      style={i !== 0 ? { paddingTop: 16 } : {}}
                                    >
                                      <span>
                                        <span>{i + 1} — </span>
                                        <Link href={'/hotspots/' + w.gateway}>
                                          <a>{animalHash(w.gateway)}</a>
                                        </Link>
                                        <span
                                          style={{
                                            color:
                                              w.is_valid || w.isValid
                                                ? '#F1C40F'
                                                : 'grey',
                                            paddingLeft: 10,
                                          }}
                                        >
                                          {w.is_valid || w.isValid
                                            ? '(Valid witness)'
                                            : '(Invalid witness)'}
                                        </span>
                                        <Table
                                          style={{ padding: '20px 0' }}
                                          pagination={{
                                            hideOnSinglePage: true,
                                          }}
                                          columns={columns}
                                          dataSource={data}
                                          // size="small"
                                        />
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </Panel>
                          </Collapse>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </ol>
      </Descriptions.Item>
    </Descriptions>
  </div>
)

export default PocReceiptsV1
