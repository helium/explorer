const WarningWidget = ({
  isVisible = true,
  warningText,
  subtitle,
  link,
  linkText,
}) => {
  if (!isVisible) return null

  return (
    <a
      className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg col-span-2 cursor-pointer flex items-center justify-between space-x-2"
      target="_blank"
      rel="noopener noreferrer"
      href={link}
    >
      <div className="">
        <span className="flex items-center justify-start">
          <img alt="" className="h-3 mr-1" src="/images/warning.svg" />
          <div className="text-yellow-700 text-sm font-semibold whitespace-nowrap">
            {warningText}
          </div>
        </span>
        {subtitle && (
          <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
        )}
      </div>
      <span className="text-gray-600 font-sans text-right whitespace-nowrap">
        {linkText} {'->'}
      </span>
    </a>
  )
}

export default WarningWidget
