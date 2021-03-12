import Link from 'next/link'
import AppLayout from '../components/AppLayout'

const Custom404 = () => {
  return (
    <>
      <AppLayout>
        <div className="h-full bg-bluegray-100 w-full">
          <main className="pt-10 md:pt-20 w-full mx-auto max-w-3xl px-10 md:px-20">
            <div className="flex flex-col items-center justify-start text-center">
              <h1 className="font-sans font-semibold text-4xl md:text-6xl">
                404
              </h1>
              <h2 className="font-sans text-lg md:text-2xl">
                Sorry, we can't find the page you're looking for.
              </h2>
            </div>
            <div className="">
              <h3 className="text-gray-300">
                Maybe one of these links will get you where you're going?
              </h3>
              <ul className="list-none">
                <li>
                  <Link href="https://www.helium.com/">
                    <a>helium.com</a>
                  </Link>
                </li>
                <li>
                  <Link href="/coverage">
                    <a>Coverage Map</a>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.helium.com/mine">
                    <a>Mine</a>
                  </Link>
                </li>
              </ul>
              <h3 className="App-header-white-2">
                Or if you think you shouldn't be seeing this error, please feel
                free to:
              </h3>
              <ul>
                <li>
                  <Link href="https://github.com/helium/explorer/issues/new">
                    <a>Create a GitHub issue</a>
                  </Link>
                </li>
                <li>
                  <Link href="https://discord.com/invite/helium">
                    <a>Report the issue in the #explorer channel on Discord</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="errorFiller"></div>
          </main>
        </div>
      </AppLayout>
    </>
  )
}

export default Custom404
