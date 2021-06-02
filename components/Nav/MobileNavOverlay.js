import NavLinks from './NavLinks'
import classNames from 'classnames'
import FocusTrap from 'focus-trap-react'
const CloseButton = ({ className, closeFunction }) => (
  <button
    className={classNames(
      'cursor-pointer w-10 h-10 flex items-center justify-center outline-none border-solid border border-transparent focus:border-navy-400',
      className,
    )}
    onClick={closeFunction}
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
        <div className="relative flex flex-col items-center justify-center h-screen w-full p-10">
          <CloseButton
            className="absolute top-4 right-4"
            closeFunction={toggleMenu}
          />
          <NavLinks
            className="flex flex-col items-center justify-center space-y-8"
            navLinkClasses="text-xl text-white font-sans font-semibold border-solid border border-transparent focus:border-navy-400 hover:text-gray-600"
            onNavLinkClick={toggleMenu}
          >
            <div className="pt-5" />
            <CloseButton closeFunction={toggleMenu} />
          </NavLinks>
        </div>
      </div>
    </FocusTrap>
  )
}

export default MobileNavOverlay
