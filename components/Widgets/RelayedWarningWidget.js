import { isRelay } from '../Hotspots/utils'

const RelayedWarningWidget = ({ hotspot }) => {
  const isRelayed = isRelay(hotspot.status.listenAddrs)

  if (!isRelayed) return null

  return (
    <a
      className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg col-span-2 cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
      href="https://docs.helium.com/troubleshooting/network-troubleshooting"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center justify-start">
          <img className="h-3 mr-1" src="/images/warning.svg" />
          <div className="text-yellow-700 text-sm font-semibold whitespace-nowrap">
            Hotspot is being Relayed.
          </div>
        </span>
        <p className="text-gray-600 font-sans m-0">{'Get help ->'}</p>
      </div>
    </a>
  )
}

export default RelayedWarningWidget
