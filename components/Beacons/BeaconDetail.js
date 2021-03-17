const BeaconDetail = ({ icon, children }) => (
  <div className="mb-2 text-gray-400">
    <span className="w-5 inline-block">
      <img src={icon} alt="" />
    </span>
    {children}
  </div>
)
export default BeaconDetail
