import classNames from 'classnames'
import FocusTrap from 'focus-trap-react'
import { useContext } from 'react'
import { changelogContent } from './changelog-content'
import ChangelogContext from './ChangelogContext'

const CloseButton = ({ className, onClick }) => (
  <button
    className={classNames(
      'cursor-pointer w-10 h-10 flex items-center justify-center outline-none border-solid border border-transparent focus:border-navy-400',
      className,
    )}
    onClick={onClick}
  >
    <img className="" src="/images/close-icon.svg" alt="" />
  </button>
)

const ChangelogOverlay = () => {
  const { changelogShown, hideChangelog, setAllChangelogItemsAsSeen } =
    useContext(ChangelogContext)

  if (!changelogShown) return null

  return (
    <FocusTrap active={changelogShown}>
      <div
        className={classNames(
          'absolute transition-all duration-100 ease-in-out top-0 z-50 left-0 h-screen w-screen mobilenav-blur',
        )}
      >
        <div className="bg-white rounded-xl max-w-lg transform-gpu mx-4 md:mx-auto mt-[10%] p-6 md:p-10 relative max-h-[70%] overflow-y-auto">
          <p className="font-semibold text-2xl md:text-4xl pb-5 font-sans tracking-tighter">
            What's New?
          </p>
          {Object.keys(changelogContent).map(
            (changelogItemKey, index, { length }) => {
              const itemDetails = changelogContent[changelogItemKey]
              if (!itemDetails.active) return null
              return (
                <div className="">
                  <p className="text-navy-400 tracking-tight font-medium text-xl pb-2 font-sans">
                    {itemDetails.title}
                  </p>
                  <div className="space-y-2">
                    {itemDetails.description.map((contentBlock) => {
                      if (contentBlock.type === 'paragraph') {
                        return (
                          <p className="text-gray-700 text-md font-light tracking-tight leading-tight">
                            {contentBlock.content}
                          </p>
                        )
                      }
                      if (contentBlock.type === 'image') {
                        return (
                          <img
                            src={contentBlock.content}
                            alt=""
                            className="pt-2"
                          />
                        )
                      }
                      if (contentBlock.type === 'link') {
                        return (
                          <div className="py-4">
                            <a
                              href={contentBlock.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-navy-400 font-medium font-sans"
                            >
                              Read more {'->'}
                            </a>
                          </div>
                        )
                      }
                      return <div>{contentBlock.content}</div>
                    })}
                  </div>
                  {/* divider */}
                  {index !== length - 1 && (
                    <div className="border-b border-solid border-gray-350 w-full h-px my-5" />
                  )}
                </div>
              )
            },
          )}
          <CloseButton
            className="absolute top-4 right-4"
            onClick={() => {
              setAllChangelogItemsAsSeen()
              hideChangelog()
            }}
          />
        </div>
      </div>
    </FocusTrap>
  )
}

export default ChangelogOverlay
