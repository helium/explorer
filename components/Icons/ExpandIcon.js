import classNames from 'classnames'

const ExpandIcon = ({ className, expanded = false, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className, {
        'w-6 h-auto text-gray-525': !className,
      })}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={style}
    >
      {!expanded ? (
        // plus icon
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ) : (
        // minus icon
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      )}
    </svg>
  )
}

export default ExpandIcon
