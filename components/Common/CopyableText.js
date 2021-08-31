import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'

const CopyableText = ({
  textToCopy,
  tooltip,
  className,
  iconClasses,
  children,
}) => {
  const [successStatus, setSuccessStatus] = useState(false)

  useEffect(() => {
    const timer = window?.setTimeout(() => {
      setSuccessStatus(false)
    }, 1500)

    return () => window?.clearTimeout(timer)
  }, [successStatus])

  const fallbackCopyTextToClipboard = (text) => {
    if (!document) return
    let textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      let successful = document.execCommand('copy')
      setSuccessStatus(successful)
    } catch (err) {
      setSuccessStatus(false)
      console.error('Unable to copy', err)
    }

    document.body.removeChild(textArea)
  }

  const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
      // if navigator.clipboard API isn't available
      fallbackCopyTextToClipboard(text)
      return
    }
    navigator.clipboard.writeText(text).then(
      function () {
        setSuccessStatus(true)
      },
      function (err) {
        setSuccessStatus(false)
        console.error('Unable to copy', err)
      },
    )
  }

  if (!textToCopy) return <span className={className}>{children}</span>

  return (
    <>
      <span
        className="relative inline-block"
        onClick={() => copyTextToClipboard(textToCopy)}
      >
        <span className="relative inline-flex items-center justify-between">
          <span className={classNames({ 'mr-2': !className }, className)}>
            {children}
          </span>
          <span className="flex-1">
            {successStatus ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={classNames(
                  'inline-block text-green-500',
                  { 'h-4 w-auto': !iconClasses },
                  iconClasses,
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
                {/* TODO: add "Copied!" tooltip */}
                {/* <span
                className={classNames(
                  'rounded-md opacity-75 bg-gray-800 p-1.5',
                )}
              >
                <p className="text-white text-xs font-sans">Copied!</p>
              </span> */}
              </svg>
            ) : (
              <Tooltip title={tooltip}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={classNames(
                    'inline-block text-gray-600 cursor-pointer',
                    { 'h-4 w-auto': !iconClasses },
                    iconClasses,
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </Tooltip>
            )}
          </span>
        </span>
      </span>
    </>
  )
}

export default CopyableText
