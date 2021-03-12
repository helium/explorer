import { HelpLinkList, HelpLink } from './404'
import AppLayout from '../components/AppLayout/AppLayout'

const Error = ({ statusCode, statusMessage }) => {
  console.error(statusMessage)
  return (
    <AppLayout>
      <div className="bg-navy-500 w-full">
        <div className="py-10 md:py-20 w-full mx-auto max-w-xl px-10 md:px-20">
          <div className="flex flex-col items-center justify-start text-center">
            <h1 className="m-0 p-0 font-sans font-semibold text-white text-4xl md:text-6xl">
              {statusCode
                ? `Error ${statusCode}${
                    statusMessage ? `: ${statusMessage}` : ''
                  }`
                : ' mnUnknown Error'}
            </h1>
            <h2 className="m-0 p-0 pt-5 font-sans text-white text-lg md:text-2xl">
              {statusCode
                ? `Sorry about that. An unexpected error ${statusCode} occurred on our server.`
                : 'Sorry about that. An unexpected error occurred in your browser.'}
            </h2>
          </div>
        </div>
      </div>
      <div className="bg-bluegray-100 w-full">
        <div className="py-10 md:pt-20 w-full mx-auto max-w-3xl px-10 md:px-20">
          <h3 className="text-gray-300 font-sans font-normal text-lg text-center normal-case tracking-normal">
            Let us know how you got here so we can fix it
          </h3>
          <HelpLinkList>
            <HelpLink
              href={`https://github.com/helium/explorer/issues/new?labels=bug&title=Unexpected+${
                statusCode ? statusCode : ''
              }+error`}
              external
            >
              Create an issue on GitHub
            </HelpLink>
            <HelpLink href="https://discord.com/invite/helium" external>
              Report the issue on Discord
            </HelpLink>
          </HelpLinkList>
          <h3 className="text-gray-300 font-sans font-normal text-lg text-center normal-case tracking-normal pt-10">
            Or try one of these links
          </h3>
          <HelpLinkList>
            <HelpLink href="/hotspots">Hotspots</HelpLink>
            <HelpLink href="/blocks">Blocks</HelpLink>
            <HelpLink href="/market">Market Data</HelpLink>
            <HelpLink href="/consensus">Consensus</HelpLink>
            <HelpLink href="/coverage">Coverage Map</HelpLink>
            <HelpLink href="https://www.helium.com/" external>
              helium.com
            </HelpLink>
          </HelpLinkList>
        </div>
      </div>
    </AppLayout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const statusMessage = res
    ? res.statusMessage
    : err
    ? err.statusMessage
    : 'Not Found'

  return { res, err, statusCode, statusMessage }
}

export default Error
