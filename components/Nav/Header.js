import { Link } from 'react-router-i18n'
import SearchBar from '../SearchBar/SearchBar'
import MobileNavOverlay from './MobileNavOverlay'
import NavLinks from './NavLinks'
import classNames from 'classnames'
import useToggle from '../../utils/useToggle'
import FeedbackBubble from '../FeedbackBubble'
import FeedbackIcon from '../Icons/Feedback'

const MenuButton = () => {
  const [menuOpen, toggleMenu] = useToggle()

  return (
    <>
      <div
        className={classNames(
          'cursor-pointer md:hidden block transition-all duration-200',
          {
            'opacity-100': !menuOpen,
            'opacity-0': menuOpen,
          },
        )}
        onClick={toggleMenu}
      >
        <img src="/images/menu.svg" />
      </div>
      <MobileNavOverlay menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </>
  )
}

const Header = () => {
  return (
    <header className="fixed w-full z-30 p-4 flex items-center justify-between">
      <Link to="/">
        <a>
          <img src="/images/logo-sm.svg" />
        </a>
      </Link>

      <div className="grid grid-flow-col gap-8 items-center">
        <NavLinks className="hidden md:grid grid-flow-col gap-4" />
        <FeedbackBubble className="hidden md:flex">
          <div className="bg-navy-400 hover:bg-navy-300 px-3 py-1 cursor-pointer rounded-lg">
            <span className="text-sm text-white flex items-center">
              Feedback
              <FeedbackIcon className="ml-1 h-4 w-4 text-white" />
            </span>
          </div>
        </FeedbackBubble>
        <FeedbackBubble className="fixed md:hidden z-30 top-20 left-0">
          <div className="bg-navy-400 hover:bg-navy-300 p-3 cursor-pointer rounded-r-lg">
            <FeedbackIcon className="h-5 w-5 text-white" />
          </div>
        </FeedbackBubble>
        <div className="grid grid-flow-col gap-4 items-center">
          <SearchBar />
          <MenuButton />
        </div>
      </div>
    </header>
  )
}

export default Header
