import classNames from 'classnames'

const Previous = ({ classes }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={classNames(classes)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

export default Previous
