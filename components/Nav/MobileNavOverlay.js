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
    <img src="/images/close-menu.svg" />
  </button>
)

const MobileNavOverlay = ({ menuOpen, toggleMenu }) => {
  return (
    <FocusTrap active={menuOpen}>
      <div
        className={classNames(
          'md:hidden transform-gpu absolute transition-all duration-100 ease-in-out top-0 z-50 left-0 h-screen w-screen bg-navy-900 opacity-90',
          { 'translate-x-full': !menuOpen, 'translate-x-0': menuOpen },
        )}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <div className="relative flex flex-col items-center justify-center h-screen w-full p-10 space-y-20">
          <CloseButton
            className="absolute top-4 right-4"
            onClick={toggleMenu}
          />
          <Link to="/" onClick={toggleMenu}>
            <img
              src="/images/logo-sm.svg"
              className="border-solid border border-transparent focus:border-navy-400"
            />
          </Link>
          <NavLinks
            className="flex flex-col items-center justify-center space-y-8"
            navLinkClasses="text-xl text-white font-sans font-semibold border-solid border border-transparent focus:border-navy-400 hover:text-gray-600"
            onNavLinkClick={toggleMenu}
          />
        </div>
      </div>
    </FocusTrap>
  )
}

export default MobileNavOverlay
