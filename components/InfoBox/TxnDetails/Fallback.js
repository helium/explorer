import React from 'react'
import { Descriptions } from 'antd'
import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'

import { Balance } from '@helium/currency'

const GenericObjectWidget = ({ title, value }) => {
  return (
    <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
      <div className="text-xl font-medium text-black my-1.5 tracking-tight w-full break-all pb-4">
        {title}
      </div>
      <div className="space-y-2">
        {Object.entries(value).map(([key, value]) => {
          return (
            <div key={key} className="flex justify-between items-center">
              <div>
                <div className="text-base leading-tight tracking-tight">
                  {key}
                </div>
                <div className="text-sm leading-tight tracking-tighter text-gray-600">
                  {value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Fallback = ({ txn }) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
      {Object.entries(txn).map(([key, value]) => {
        // these fields will show up in the title / breadcrumbs / subtitle, so no need to repeat them
        if (
          key === 'type' ||
          key === 'time' ||
          key === 'height' ||
          key === 'hash'
        ) {
          return
        }

        // don't show meta info
        if (key === 'name' || key === 'color' || key === 'tooltip') {
          return
        }

        // TODO: use a better way to determine if the value is a wallet address
        if (key === 'payer' || key === 'payee' || key === 'owner') {
          return (
            <AccountWidget title={key} address={value} span={'col-span-2'} />
          )
        }

        if (key === 'amount' || key === 'fee') {
          if (value === 0) {
            return <Widget title={key} value={value} span={'col-span-2'} />
          } else {
            const balance = new Balance(value.integerBalance, value.type)
            return (
              <Widget
                title={key}
                value={balance.toString(2)}
                span={'col-span-2'}
              />
            )
          }
        }

        if (typeof value === 'object') {
          return <GenericObjectWidget title={key} value={value} />
        }

        return <Widget title={key} span={'col-span-2'} value={value} />
      })}
    </div>
  )
}

export default Fallback
