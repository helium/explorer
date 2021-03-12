import Link from 'next/link'
import AppLayout from '../components/AppLayout'
import ExternalLinkIcon from '../components/Icons/ExternalLink'
import InternalLinkIcon from '../components/Icons/InternalLink'

export const HelpLinkList = ({ children }) => (
  <div className="max-w-sm mx-auto">
    <ul
      role="list"
      className="list-none m-0 p-0 flex flex-col items-center justify-center"
    >
      {children}
    </ul>
  </div>
)
export const HelpLink = ({ children, href, external }) => {
  if (external) {
    return (
      <a
        target="_blank"
        rel="noopener"
        rel="noreferrer"
        href={href}
        className="w-full py-4 px-5  mb-4 bg-white shadow-md transition-all hover:shadow-xl rounded-md"
      >
        <li className="text-navy-600 font-semibold w-full m-0 p-0">
          <div className="flex flex-row justify-between items-center">
            {children}
            <ExternalLinkIcon className="h-5 w-auto text-gray-300" />
          </div>
        </li>
      </a>
    )
  } else {
    return (
      <Link href={href}>
        <a className="w-full py-4 px-5  mb-4 bg-white shadow-md transition-all hover:shadow-xl rounded-md">
          <li className="text-navy-600 font-semibold w-full m-0 p-0">
            <div className="flex flex-row justify-between items-center">
              {children}
              <InternalLinkIcon className="h-5 w-auto text-gray-300" />
            </div>
          </li>
        </a>
      </Link>
    )
  }
}

const Custom404 = () => {
  return (
    <>
      <AppLayout>
        <div className="bg-navy-500 w-full">
          <div className="py-10 md:py-20 w-full mx-auto max-w-3xl px-10 md:px-20">
            <div className="flex flex-col items-center justify-start text-center">
              <h1 className="m-0 p-0 font-sans font-semibold text-white text-4xl md:text-6xl">
                404
              </h1>
              <h2 className="m-0 p-0 pt-5 font-sans text-white text-lg md:text-2xl">
                Sorry, that page doesn't seem to exist.
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
                href="https://github.com/helium/explorer/issues/new?labels=bug&title=Unexpected+404+error"
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
    </>
  )
}

export default Custom404
