import { FeedbackFish } from '@feedback-fish/react'
import FeedbackIcon from './Icons/Feedback'

const FeedbackBubble = () => {
  const inner = (
    <FeedbackFish projectId={process.env.FEEDBACK_FISH_PROJECT_ID}>
      <div className=" bg-navy-400 rounded-l-lg px-4 py-3 md:p-3 md:w-20 md:-mr-1 cursor-pointer transform md:hover:-translate-x-1 transition-all duration-150">
        <FeedbackIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
      </div>
    </FeedbackFish>
  )

  return (
    <>
      <div className="flex md:hidden fixed z-30 top-16 right-0">{inner}</div>
      <div className="hidden md:flex fixed z-30 bottom-40 right-0">{inner}</div>
    </>
  )
}

export default FeedbackBubble
