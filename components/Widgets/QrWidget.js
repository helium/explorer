import QRCode from 'react-qr-code'
import Widget from './Widget'

const QrWidget = ({ address }) => {
  if (!address) return null

  return (
    <div className="col-span-2 flex space-x-4">
      <div className="flex">
        <QRCode value={address} size={100} />
      </div>
      <Widget
        title="QR Code"
        titleIcon={<img alt="QR Code icon" src="/images/qr.svg" />}
        subtitle="HNT can be sent to this account using the QR feature in the Helium App."
      />
    </div>
  )
}

export default QrWidget
