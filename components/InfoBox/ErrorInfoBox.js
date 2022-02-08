import InfoBox from './InfoBox'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import Widget from '../Widgets/Widget'
import WarningWidget from '../Widgets/WarningWidget'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

const ErrorInfoBox = ({
  errorType = 404,
  errorTitle = '404 — Not Found',
  warningTitle = "This page doesn't exist",
  breadcrumbs,
  subtitleText,
}) => {
  const { pathname: path } = useLocation()

  const issueLink =
    errorType === 404
      ? `https://github.com/helium/explorer/issues/new?labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+404%20error%20at%20URL:%20${path}`
      : `https://github.com/helium/explorer/issues/new?labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+${errorType}%20error%20at%20URL:%20${path}`

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <InfoBox
        title={errorTitle}
        subtitles={
          subtitleText
            ? [
                [
                  {
                    iconPath: '/images/warning.svg',
                    title: subtitleText,
                  },
                ],
              ]
            : []
        }
        breadcrumbs={breadcrumbs}
      >
        <InfoBoxPaneContainer>
          {
            <WarningWidget
              warningText={
                errorType === 404 ? warningTitle : 'Something went wrong'
              }
              isVisible
            />
          }
          <Widget
            span={2}
            title="Create an issue on GitHub"
            value="Report a bug"
            linkTo={issueLink}
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
