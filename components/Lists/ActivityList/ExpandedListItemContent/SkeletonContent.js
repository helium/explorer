import Widget from '../../../Widgets/Widget'

const SkeletonContent = () => {
  return (
    <div className="grid grid-cols-1 space-y-2">
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
    </div>
  )
}

export default SkeletonContent
