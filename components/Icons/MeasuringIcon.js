const MeasuringIcon = ({ active, className }) => {
  return (
    <svg
      className={className}
      width="42"
      height="31"
      viewBox="0 0 42 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.897 19.025L18.8644 12.0403M22.897 19.025L31.1649 14.2515M22.897 19.025L14.6291 23.7984M31.1649 14.2515L39.4328 9.47801L35.4002 2.49332M31.1649 14.2515L29.1323 10.7309M14.6291 23.7984L6.36123 28.5719L2.32861 21.5872M14.6291 23.7984L12.5965 20.2778"
        stroke={active ? 'white' : 'black'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export default MeasuringIcon
