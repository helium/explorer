const Widget = ({ title, value, change, subtitle, span = 1 }) => {
  return (
    <div className={`bg-gray-200 p-3 rounded-lg col-span-${span}`}>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-3xl font-medium my-1.5 tracking-tighter">
        {value}
      </div>
      <div className="text-green-500 text-sm font-medium">{change}</div>
      {subtitle}
    </div>
  )
}

export default Widget
