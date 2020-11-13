import React from 'react'
import { Descriptions, Collapse } from 'antd'

import { h3Distance } from 'h3-js'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import PocPath from './PocPath'
const { Panel } = Collapse

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
        <ol>
          {txn.path.map((p, idx) => {
            return (
              <div key={`${p.receipt}-${idx}`}>
                <div
                  style={{
                    marginBottom: '0px',
                    paddingTop: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
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
                        width: '22px',
                        heigh: '22px',
                        borderRadius: 22,
                        textAlign: 'center',
                      }}
                    >
                      {idx + 1}
                    </p>
                    <Link href={'/hotspots/' + p.challengee}>
                      <a style={{ paddingLeft: 10 }}>
                        {animalHash(p.challengee)}
                      </a>
                    </Link>
                    {p.receipt && p.receipt.origin === 'radio' && (
                      <span style={{ paddingLeft: 10, color: '#777' }}>
                        {`— received at RSSI ${p.receipt.signal}dBm, SNR ${
                          p.receipt.snr ? `${p.receipt.snr.toFixed(2)}dB` : ''
                        }${
                          p.receipt !== null && p.receipt.datarate !== undefined
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
                    marginLeft: '30px',
                    backgroundColor: '#eee',
                  }}
                >
                  {p.witnesses.length > 0 && (
                    <>
                      <Collapse
                        // Uncomment below line to enable witness panel to be shown by default
                        defaultActiveKey={[idx]}
                      >
                        <Panel header="Witnesses" key={idx}>
                          <div style={{ paddingLeft: 20 }}>
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
                                h3exclusionCells <= witnessDistInH3Res12Cells
                              const h3DistanceMaxValid =
                                witnessDistInH3Res12Cells < h3maxHopCells

                              const h3DistanceIsValid =
                                h3DistanceMinValid && h3DistanceMaxValid

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
                                        color: w.is_valid ? '#F1C40F' : 'grey',
                                        paddingLeft: 10,
                                      }}
                                    >
                                      {w.is_valid
                                        ? '(Valid witness)'
                                        : '(Invalid witness)'}
                                    </span>
                                    <ul>
                                      <li>RSSI: {`${w.signal}dBm`}</li>
                                      {w.snr && (
                                        <li>{`SNR: ${w.snr.toFixed(2)}dB`}</li>
                                      )}
                                      {txn.height > 123479 && (
                                        <li>
                                          Distance:{' '}
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
                                              : `${witnessDistInKm.toFixed(
                                                  2,
                                                )}km`}
                                          </span>
                                          <span
                                            style={
                                              !h3DistanceIsValid
                                                ? { color: '#CA0926' }
                                                : {}
                                            }
                                          >
                                            {!h3DistanceMinValid
                                              ? ' (too close)'
                                              : !h3DistanceMaxValid
                                              ? ' (too far)'
                                              : ''}
                                          </span>
                                        </li>
                                      )}
                                      {w.datarate !== undefined &&
                                        ((Array.isArray(w.datarate) &&
                                          w.datarate.length > 0) ||
                                          (!Array.isArray(w.datarate) &&
                                            w.datarate !== null)) && (
                                          <li>
                                            Data rate:{' '}
                                            {Array.isArray(w.datarate)
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
                                                }`}
                                          </li>
                                        )}
                                    </ul>
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
            )
          })}
        </ol>
      </Descriptions.Item>
    </Descriptions>
  </div>
)

export default PocReceiptsV1
