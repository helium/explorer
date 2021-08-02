import InfoBox from './InfoBox'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import Widget from '../Widgets/Widget'
import WarningWidget from '../Widgets/WarningWidget'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

const ErrorInfoBox = ({ errorType = 404, errorTitle = '404 — Not Found' }) => {
  const { pathname: path } = useLocation()

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <InfoBox title={errorTitle}>
        <InfoBoxPaneContainer>
          {
            <WarningWidget
              warningText={
                errorType === 404
                  ? "This page doesn't exist"
                  : 'Something went wrong'
              }
              isVisible
            />
          }
          <Widget
            span={2}
            title="Create an issue on GitHub"
            value="Report a bug"
            linkTo={`https://github.com/helium/explorer/issues/new?labels=bug&template=bug_report.md&title=Unexpected%20404%20error%20at%20URL:%20${path}`}
          />
          <Widget
            span={2}
            title="Ask the community for help"
            value="Join the Discord"
            linkTo="https://discord.gg/9WpdzeSpE7"
          />
        </InfoBoxPaneContainer>
      </InfoBox>
    </>
  )
}

export default ErrorInfoBox
