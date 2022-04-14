import classNames from 'classnames'

const ArrowIcon = ({ className }) => {
  return (
    <svg
      className={classNames(className, { 'w-6 h-6': !className })}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      ></path>
    </svg>
  )
}
export default ArrowIcon
