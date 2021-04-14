import classNames from 'classnames'

const NavItem = ({ title, active = false }) => (
  <span
    className={classNames(
      'py-1 px-2.5 inline-block font-medium text-base cursor-pointer',
      {
        'text-gray-700': !active,
        'text-white bg-navy-400 rounded-full': active,
      },
    )}
  >
    {title}
  </span>
)

const PillNavbar = () => {
  return (
    <div className="flex md:hidden mt-5 px-2 overflow-x-scroll justify-center no-scrollbar">
      <NavItem title="Overview" />
      <NavItem title="Hotspots" active />
      <NavItem title="Beacons" />
      <NavItem title="Blocks" />
      <NavItem title="Validators" />
      <NavItem title="Market" />
      <span className="pr-4" />
    </div>
  )
}

export default PillNavbar
