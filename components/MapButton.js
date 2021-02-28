const MapButton = ({ classes, children, handleToggle }) => {
  return (
    <input
      type="checkbox"
      onChange={handleToggle}
      id="zoom-in"
      className={`focus:ring focus:outline-none absolute w-11 h-11 shadow-md rounded-full z-10 flex items-center justify-center bg-navy-500 zmap-zoom-in-button ${classes}`}
    >
      {children}
    </input>
  )
}

export default MapButton
