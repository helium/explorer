import classNames from 'classnames'
import { Tooltip } from 'antd'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'

const ChecklistItem = ({
  item,
  length,
  nextMilestoneIndex,
  index,
  currentIndex,
  setCurrentIndex,
}) => {
  const isNextMilestone =
    index === nextMilestoneIndex && nextMilestoneIndex !== -1
  const isCompleted = item.completed
  const isSelected = index === currentIndex

  const sliceWidth = `${(1 / length) * 100}%`

  return (
    <Tooltip key={item.title} placement={'bottom'} title={item.title}>
      <div
        onClick={() => setCurrentIndex(index)}
        className={classNames(
          'h-8 md:h-4 p-2 cursor-pointer border-solid border-l border-gray-200',
          {
            'bg-navy-400': isCompleted && !isSelected,
            'bg-navy-300': isCompleted && isSelected,
            'animate-pulse opacity-25 bg-navy-400': isNextMilestone,
            'bg-gray-300': !isCompleted && !isNextMilestone && !isSelected,
            'bg-gray-350': !isCompleted && !isNextMilestone && isSelected,
            'rounded-l-md': index === 0,
            'rounded-r-md': index + 1 === length,
          },
        )}
        style={{
          width: sliceWidth,
        }}
      />
    </Tooltip>
  )
}

const ChecklistItemDetails = ({ selectedChecklistItemInfo }) => {
  const [showDetails, toggleShowDetails] = useToggle()

  return (
    <div>
      {showDetails && (
        <>
          <p className="text-md font-sans text-black pt-2 m-0">
            {selectedChecklistItemInfo?.detailText}
          </p>
          <p className="text-xs font-sans text-gray-600 pt-2 m-0">
            {selectedChecklistItemInfo?.infoTooltipText}
          </p>
        </>
      )}
      <div
        className={classNames(
          'w-full bg-gray-300 hover:bg-gray-350 transition-all duration-200 cursor-pointer rounded-lg mt-2 flex items-center justify-center',
          { '': showDetails },
        )}
        onClick={toggleShowDetails}
      >
        <p className="text-gray-600 font-sans text-sm p-2 m-0">
          {showDetails ? 'Hide' : 'Show'} details
        </p>
        <ChevronIcon
          className={classNames(
            'h-auto  text-gray-600 transition-all duration-200  w-4',
            {
              'transform rotate-180': !showDetails,
            },
          )}
        />
      </div>
    </div>
  )
}

const ChecklistItems = ({
  possibleChecklistItems,
  nextMilestoneIndex,
  selectedChecklistItemInfo,
  currentIndex,
  setCurrentIndex,
}) => {
  return (
    <>
      <div className="flex items-center justify-center h-10 md:h-5">
        {possibleChecklistItems.map((checklistItem, index, { length }) => {
          return (
            <ChecklistItem
              key={checklistItem.title}
              item={checklistItem}
              index={index}
              currentIndex={currentIndex}
              nextMilestoneIndex={nextMilestoneIndex}
              length={length}
              setCurrentIndex={setCurrentIndex}
            />
          )
        })}
      </div>
      <ChecklistItemDetails
        selectedChecklistItemInfo={selectedChecklistItemInfo}
      />
    </>
  )
}

export default ChecklistItems
