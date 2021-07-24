import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from './InfoBoxPaneContainer'

const SkeletonWidgets = () => {
  return (
    <InfoBoxPaneContainer>
      <Widget span={2} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={2} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
      <Widget span={1} subtitle="subtitle" isLoading />
    </InfoBoxPaneContainer>
  )
}

export default SkeletonWidgets
