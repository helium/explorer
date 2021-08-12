import NavLinks from './NavLinks'
import classNames from 'classnames'
import FocusTrap from 'focus-trap-react'
import { Link } from 'react-router-i18n'

const CloseButton = ({ className, onClick }) => (
  <button
    className={classNames(
      'cursor-pointer w-10 h-10 flex items-center justify-center outline-none border-solid border border-transparent focus:border-navy-400',
      className,
    )}
    onClick={onClick}
  >
    <img alt="Close menu icon" src="/images/close-menu.svg" />
  </button>
)

const MobileNavOverlay = ({ menuOpen, toggleMenu }) => {
  return (
    <FocusTrap active={menuOpen}>
      <div
        className={classNames(
          'xl:hidden transform-gpu absolute transition-all duration-100 ease-in-out top-0 z-50 left-0 h-screen w-screen mobilenav-blur',
          { 'translate-x-full': !menuOpen, 'translate-x-0': menuOpen },
        )}
      >
        <div className="relative flex flex-col items-center justify-center h-screen w-full p-5 pb-10">
          <CloseButton
            className="absolute top-4 right-4"
            onClick={toggleMenu}
          />
          <Link to="/" className="pb-10" onClick={toggleMenu}>
            <img
              alt="Helium Logo"
              src="/images/logo-sm.svg"
              className="border-solid border border-transparent focus:border-navy-400"
            />
          </Link>
          <NavLinks
            className="flex flex-col items-center justify-center space-y-4"
            navLinkClasses="text-2xl text-white font-sans font-regular border-solid border border-transparent focus:border-navy-400 hover:text-gray-600"
            onNavLinkClick={toggleMenu}
          />
        </div>
      </div>
    </FocusTrap>
  )
}

export default MobileNavOverlay
