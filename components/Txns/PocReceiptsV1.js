import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import PocPath from './PocPath'

const PocReceiptsV1 = ({ txn }) => (
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
      <Descriptions.Item label="PoC Path" span={3}>
        <ol>
          {txn.path.map((p, idx) => {
            return (
              <div key={`${p.receipt}-${idx}`}>
                <p style={{ marginBottom: '0px', paddingTop: '10px' }}>
                  {idx + 1} -
                  <Link href={'/hotspots/' + p.challengee}>
                    <a>{animalHash(p.challengee)}</a>
                  </Link>
                  {p.receipt && p.receipt.origin === 'radio' ? (
                    <small>
                      {` (received at RSSI ${p.receipt.signal}dBm, SNR ${
                        p.receipt.snr ? `${p.receipt.snr.toFixed(2)}dB ` : ' '
                      }${
                        p.receipt !== null
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
                      })`}
                    </small>
                  ) : (
                    <span></span>
                  )}
                </p>
                {p.witnesses.length > 0 &&
                  p.witnesses.map((w, i) => {
                    return (
                      <div key={`${idx}-${i}`} style={{ marginLeft: '25px' }}>
                        <span>
                          <small>
                            <Link href={'/hotspots/' + w.gateway}>
                              <a>{animalHash(w.gateway)}</a>
                            </Link>
                            {`- witnessed at RSSI ${w.signal}dBm, SNR ${
                              w.snr ? `${w.snr.toFixed(2)}dB ` : ' '
                            }${
                              Array.isArray(w.datarate)
                                ? `${
                                    w.datarate.length > 0
                                      ? `, ${String.fromCharCode.apply(
                                          null,
                                          w.datarate,
                                        )}`
                                      : ``
                                  } `
                                : `${w.datarate !== null && `, ${w.datarate} `}`
                            }
                                  (${
                                    w.is_valid || w.isValid
                                      ? 'valid'
                                      : 'invalid'
                                  })`}
                          </small>
                        </span>
                      </div>
                    )
                  })}
              </div>
            )
          })}
        </ol>
      </Descriptions.Item>
    </Descriptions>
  </div>
)

export default PocReceiptsV1
