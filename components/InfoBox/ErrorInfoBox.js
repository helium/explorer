import InfoBox from './InfoBox'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import Widget from '../Widgets/Widget'
import WarningWidget from '../Widgets/WarningWidget'
import { Helmet } from 'react-helmet'

const ErrorInfoBox = ({ errorType = 404, errorTitle = '404 — Not Found' }) => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <InfoBox title={errorTitle}>
        <InfoBoxPaneContainer>
          <WarningWidget warningText="This page doesn't exist" isVisible />
          <Widget
            span={2}
            title="Create an issue on GitHub"
            value="Report a bug"
            linkTo="https://github.com/helium/explorer/issues/new"
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
