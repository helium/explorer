import React, { useState, useEffect } from 'react'
import { Descriptions, Collapse } from 'antd'

import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import PocPath from './PocPath'

const { Panel } = Collapse

import PocInfoTable from './PocInfoTable'

const formatPocRadioInfo = (receipt) => {
  const baseText = `received ${
    receipt?.signal ? `at RSSI ${receipt?.signal}dBm` : ``
  }`
  const snrText = `${
    receipt?.snr ? `, with SNR ${receipt?.snr.toFixed(2)}.dB` : ``
  }`
  let dataRateText = ''

  if (receipt !== null && receipt.datarate !== undefined) {
    if (Array.isArray(receipt.datarate)) {
      dataRateText = `${
        receipt.datarate.length > 0
          ? `, ${String.fromCharCode.apply(null, receipt.datarate)}`
          : ``
      }`
    } else {
      if (receipt.datarate !== null) {
        dataRateText = `, ${receipt.datarate} `
      }
    }
  }

  const pocRadioInfo = `${baseText}${snrText}${dataRateText}`
  return pocRadioInfo
}

const PocReceiptsV1 = ({ txn }) => {
  const [h3exclusionCells, setH3ExclusionCells] = useState()
  const [h3maxHopCells, setH3MaxHopCells] = useState()

  useEffect(async () => {
    await fetch('https://api.helium.io/v1/vars/poc_v4_exclusion_cells')
      .then((res) => res.json())
      .then((min) => {
        setH3ExclusionCells(min.data)
      })
    await fetch('https://api.helium.io/v1/vars/poc_max_hop_cells')
      .then((res) => res.json())
      .then((max) => {
        setH3MaxHopCells(max.data)
      })
  }, [])

  return (
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
      <span className="poc-outer-container">
        <Descriptions bordered layout="vertical">
          <Descriptions.Item label="PoC Path" span={3}>
            <ol style={{ margin: 0, padding: 0 }}>
              {txn.path.map((participant, participantIndex, { length }) => {
                return (
                  <>
                    <div key={`${participant.receipt}-${participantIndex}`}>
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
                            {participantIndex !== 0 && (
                              <span
                                className={`poc-path-line-above ${
                                  txn.path[participantIndex - 1].receipt &&
                                  txn.path[participantIndex - 1].receipt
                                    .origin === 'radio'
                                    ? 'poc-path-line-above-2'
                                    : ''
                                }`}
                                style={{
                                  backgroundColor: `${
                                    txn.path[participantIndex - 1].receipt ||
                                    txn.path[participantIndex - 1].witnesses
                                      .length > 0 ||
                                    participant.receipt ||
                                    participant.witnesses.length > 0
                                      ? '#09B851'
                                      : '#CA0926'
                                  }`,
                                }}
                              />
                            )}
                            <p
                              style={{
                                backgroundColor: `${
                                  participant.receipt ||
                                  participant.witnesses.length > 0 ||
                                  (txn.path[participantIndex + 1] &&
                                    (txn.path[participantIndex + 1].receipt ||
                                      txn.path[participantIndex + 1].witnesses
                                        .length > 0))
                                    ? '#09B851'
                                    : '#CA0926'
                                }`,
                              }}
                              className="poc-participant-number-circle"
                            >
                              {participantIndex + 1}
                            </p>
                            <Link href={'/hotspots/' + participant.challengee}>
                              <a className="poc-participant-name">
                                {animalHash(participant.challengee)}
                              </a>
                            </Link>
                          </div>
                          {participant.receipt &&
                            participant.receipt.origin === 'radio' && (
                              <span
                                className="poc-witness-receive-info"
                                style={{ marginLeft: 14 }}
                              >
                                {formatPocRadioInfo(participant.receipt)}
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
                        {participantIndex !== length - 1 && (
                          <span
                            className={`poc-path-line ${
                              participant.receipt &&
                              participant.receipt.origin === 'radio'
                                ? 'poc-path-line-with-info'
                                : ''
                            }`}
                            style={{
                              backgroundColor: `${
                                participant.receipt ||
                                participant.witnesses.length > 0 ||
                                (txn.path[participantIndex + 1] &&
                                  (txn.path[participantIndex + 1].receipt ||
                                    txn.path[participantIndex + 1].witnesses
                                      .length > 0))
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
                          {participant.witnesses.length > 0 && (
                            <>
                              <Collapse
                                defaultActiveKey={[participantIndex]}
                                className="poc-witness-collapsable-panel"
                              >
                                <Panel
                                  header={`${participant.witnesses.length} witnesses`}
                                  key={participantIndex}
                                >
                                  <div className="poc-witness-table">
                                    {participant.witnesses.map((w, i) => {
                                      return (
                                        <PocInfoTable
                                          participant={participant}
                                          witness={w}
                                          witnessIndex={i}
                                          participantIndex={participantIndex}
                                          h3exclusionCells={h3exclusionCells}
                                          h3maxHopCells={h3maxHopCells}
                                        />
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
      </span>
    </div>
  )
}

export default PocReceiptsV1
