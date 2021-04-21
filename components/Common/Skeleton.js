const Skeleton = ({ w = '3/4', my = '2' }) => (
  <div class={`animate-pulse h-4 bg-gray-400 my-${my} rounded w-${w}`} />
)

export default Skeleton
