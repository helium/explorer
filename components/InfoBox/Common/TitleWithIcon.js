const TitleWithIcon = ({ title, iconPath }) => (
  <span className="flex items-center justify-start">
    <img alt="" src={iconPath} className="h-4 w-auto mr-1" />
    {title}
  </span>
)

export default TitleWithIcon
