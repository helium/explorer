import InfoBoxPaneContainer from './InfoBoxPaneContainer'

const ErrorPane = ({ errorType = 404, errorText = '404 - Not Found' }) => {
  return <InfoBoxPaneContainer>{errorText}</InfoBoxPaneContainer>
}

export default ErrorPane
