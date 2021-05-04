import Timestamp from 'react-timestamp'
import { Link } from 'react-router-i18n'
import { useBlockHeight } from '../../../data/blocks'

const BlockMetaData = ({ block }) => {
  const { height } = useBlockHeight()

  return (
    <div className="flex flex-col items-start font-sans text-gray-800 p-5 pb-2">
      <span className="flex items-center justify-start">
        <img src="/images/clock.svg" className="w-4 h-auto" />
        <Timestamp
          date={block.time}
          className="tracking-tight text-gray-525 text-sm font-sans ml-2"
        />
      </span>
      <span className="flex flex-row items-center justify-start mt-2">
        <img src="/images/txn.svg" className="w-4 h-auto" />
        <p className="tracking-tight text-gray-525 text-sm font-sans m-0 ml-2">
          {block.transactionCount} transactions
        </p>
      </span>
      <span className="flex flex-row items-center justify-start mt-2">
        <img src="/images/block-purple.svg" className="w-4 h-auto" />
        <p className="tracking-tight text-gray-525 text-sm font-sans m-0 ml-2">
          {block.height?.toLocaleString()}
        </p>
        <div className="flex items-center justify-start ml-2">
          <Link
            className="bg-gray-200 rounded-sm border border-solid border-gray-300 text-gray-800 text-sm h-5 w-5 flex items-center justify-center"
            to={`/blocks/${block.height - 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          {block.height < height && (
            <Link
              className="bg-gray-200 rounded-sm border border-solid border-gray-300 text-gray-800 text-sm h-5 w-5 flex items-center justify-center"
              to={`/blocks/${block.height + 1}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>
      </span>
    </div>
  )
}

export default BlockMetaData
