import classNames from 'classnames'
import { createPortal } from 'react-dom'
import CloseIcon from '../Icons/CloseIcon'

const TutorialPopup = ({
  title,
  body,
  dismissHandler,
  tooltipPositioningClasses,
  arrowPositioningClasses,
}) => {
  return createPortal(
    <>
      <div
        className={classNames(
          tooltipPositioningClasses,
          'absolute h-auto bg-green-500 bg-opacity-70 backdrop-blur-md z-30 rounded-lg',
        )}
      >
        <div className="relative flex flex-col items-start justify-start p-4">
          <span className="bg-green-500 rounded-lg px-2 py-1 mb-2">
            <span className="text-black text-xs font-bold">NEW</span>
          </span>
          <p className="text-black font-sans font-medium text-md leading-tight mb-1">
            {title}
          </p>
          <p className="text-black font-sans font-light text-sm leading-tight">
            {body}
          </p>
          <button
            className="text-white w-5 h-5 absolute top-3 right-4"
            onClick={dismissHandler}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div
        className={classNames(
          arrowPositioningClasses,
          'absolute bg-green-500 bg-opacity-60 backdrop-blur-md rotate-45 w-10 h-10 z-20',
        )}
      />
    </>,
    document?.getElementById('portal-destination'),
  )
}
export default TutorialPopup
