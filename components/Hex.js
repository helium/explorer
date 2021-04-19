const Hex = ({ width, height, fillColor, className }) => (
  <svg
    width={width ? width : 28}
    height={height ? height : 32}
    viewBox="0 0 28 32"
    fill="none"
    preserveAspectRatio
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1.1547C13.2376 0.440169 14.7624 0.440169 16 1.1547L25.8564 6.8453C27.094 7.55983 27.8564 8.88034 27.8564 10.3094V21.6906C27.8564 23.1197 27.094 24.4402 25.8564 25.1547L16 30.8453C14.7624 31.5598 13.2376 31.5598 12 30.8453L2.14359 25.1547C0.905989 24.4402 0.143594 23.1197 0.143594 21.6906V10.3094C0.143594 8.88034 0.905989 7.55983 2.14359 6.8453L12 1.1547Z"
      fill={fillColor}
    />
  </svg>
)

export default Hex
