import classNames from 'classnames'

const NavItem = ({ title, active = false }) => (
  <span
    className={classNames(
      'mr-5 py-0.5 pb-3 inline-block font-medium text-base cursor-pointer',
      {
        'text-gray-600': !active,
        'text-navy-400 border-navy-400 border-b-2 border-solid': active,
      },
    )}
  >
    {title}
  </span>
)

const TabNavbar = () => {
  return (
    <div className="border-b border-gray-400 border-solid mt-4 px-2 md:px-8 flex overflow-x-scroll justify-center no-scrollbar">
      <NavItem title="Statistics" active />
      <NavItem title="Makers" />
      <NavItem title="Charts" />
      <NavItem title="All Hotspots" />
    </div>
  )
}

export default TabNavbar
