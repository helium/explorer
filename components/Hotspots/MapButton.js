const MapButton = ({ handleClick, active, icon }) => {
  return (
    <button
      className={`left-5 bottom-5 border-none focus:ring cursor-pointer focus:outline-none absolute w-11 h-11 shadow-md rounded-full z-10 flex items-center justify-center ${
        active ? 'bg-yellow-400' : 'bg-navy-500'
      }`}
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}

export default MapButton
