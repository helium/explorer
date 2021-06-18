const WarningWidget = ({ warningCondition, warningText, link, linkText }) => {
  if (!warningCondition) return null

  return (
    <a
      className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg col-span-2 cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
      href={link}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center justify-start">
          <img alt="" className="h-3 mr-1" src="/images/warning.svg" />
          <div className="text-yellow-700 text-sm font-semibold whitespace-nowrap">
            {warningText}
          </div>
        </span>
        <p className="text-gray-600 font-sans m-0">
          {linkText} {'->'}
        </p>
      </div>
    </a>
  )
}

export default WarningWidget
