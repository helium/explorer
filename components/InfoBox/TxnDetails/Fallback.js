import classNames from 'classnames'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const GenericObjectWidget = ({ title, value }) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Widget title={title} value={'Empty array'} span={2} emptyValue />
    }
    value.map((v, i) => {
      return <Widget title={i} value={JSON.stringify(v)} span={2} />
    })
  }
  return (
    <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
      <div className="text-xl font-medium text-black my-1.5 tracking-tight w-full break-all pb-4">
        {title}
      </div>
      <div className="space-y-2">
        {Object.entries(value).map(([key, value]) => {
          if (typeof value === 'object') {
            return JSON.stringify(value)
          }
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
    <>
      <InfoBoxPaneContainer>
        {Object.entries(txn).map(([key, value]) => {
          // these fields will show up in the title / breadcrumbs / subtitle, so no need to repeat them
          if (
            key === 'type' ||
            key === 'time' ||
            key === 'height' ||
            key === 'hash'
          ) {
            return null
          }

          // don't show meta info
          if (key === 'name' || key === 'color' || key === 'tooltip') {
            return null
          }

          // TODO: use a better way to determine if the value is a wallet address
          if (key === 'payer' || key === 'payee' || key === 'owner') {
            // some txns have a value that is actually the string "undefined"
            if (value === 'undefined')
              return <Widget title={key} value={value} span={2} emptyValue />
            return <AccountWidget title={key} address={value} span={2} />
          }

          if (key === 'amount' || key === 'fee' || key === 'stakingFee') {
            if (value === 0) {
              return <Widget title={key} value={value} span={2} />
            } else {
              return <Widget title={key} value={value.toString(2)} span={2} />
            }
          }

          // TODO: have a special widget for key === 'geocode'

          if (typeof value === 'object') {
            return <GenericObjectWidget title={key} value={value} />
          }

          if (value === '') {
            return (
              <Widget title={key} span={2} value={'Empty string'} emptyValue />
            )
          }
          return <Widget title={key} span={2} value={value} />
        })}
      </InfoBoxPaneContainer>
    </>
  )
}

export default Fallback
