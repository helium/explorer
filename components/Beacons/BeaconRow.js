const BeaconRow = ({ children, className }) => (
  <div
    className={`flex flex-row justify-between${
      className ? ` ${className}` : ''
    }`}
  >
    {children}
  </div>
)
export default BeaconRow
