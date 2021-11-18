import classNames from 'classnames'

const MaintenanceMode = () => {
  return (
    <div className="h-screen w-screen bg-white">
      <header className="fixed w-full z-30 flex items-center justify-between p-4 bg-navy-500">
        <a
          href="https://status.helium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-200 flex"
        >
          <img alt="Helium Logo" src="/images/logo-sm.svg" />
        </a>
      </header>
      <div className="pt-40 max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-start justify-center">
          <p className="font-sans text-xl font-semibold text-navy-1000">
            Helium Explorer and API undergoing required maintenance
          </p>
        </div>
        <p className="font-sans text-md font-light text-navy-1000">
          The API that serves data to Explorer will be undergoing performance
          improvements and will be unavailable to all users of the network.
        </p>
        <p className="font-sans text-md font-light text-navy-1000">
          The planned outage starts November 18 2021 at 10:00am PT for 3 hours.
          For more information, visit{' '}
          <a
            href="https://status.helium.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            status.helium.com
          </a>{' '}
          or follow{' '}
          <a
            href="https://twitter.com/helium_status"
            target="_blank"
            rel="noopener noreferrer"
          >
            @helium_status
          </a>{' '}
          on twitter.
        </p>
      </div>
    </div>
  )
}
export default MaintenanceMode
