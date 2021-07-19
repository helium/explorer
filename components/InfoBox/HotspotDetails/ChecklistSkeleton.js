import classNames from 'classnames'

const ChecklistSkeleton = () => {
  const SKELETON_SLICES = 7
  const sliceWidth = `${(1 / SKELETON_SLICES) * 100}%`

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm whitespace-nowrap">
        Loading checklist data
      </div>
      <div className="flex items-center justify-center h-10 md:h-5 mt-2">
        {Array.from({ length: SKELETON_SLICES }, (_, i) => (
          <div
            key={i}
            className={classNames(
              'h-8 md:h-4 p-2 border-solid border-l border-gray-200 animate-pulse opacity-25 bg-gray-350',
              {
                'rounded-l-lg': i === 0,
                'rounded-r-lg': i === SKELETON_SLICES - 1,
              },
            )}
            style={{
              width: sliceWidth,
            }}
          />
        ))}
      </div>
    </div>
  )
}
export default ChecklistSkeleton
