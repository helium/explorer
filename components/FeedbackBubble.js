import { FeedbackFish } from '@feedback-fish/react'
import FeedbackIcon from './Icons/Feedback'

const FeedbackBubble = () => (
  <div className="flex flex-col items-end justify-start md:justify-end fixed z-30 top-16 bottom-40 right-0 pointer-events-none">
    <FeedbackFish projectId={process.env.NEXT_PUBLIC_FEEDBACK_FISH_PROJECT_ID}>
      <div className="mr-40">
        <div className="-mr-1">
          <div className="pointer-events-auto bg-navy-400 rounded-l-lg px-4 py-3 md:p-3 md:w-20z cursor-pointer transform md:hover:-translate-x-1 -mr-40 ml-20 transition-all duration-150">
            <FeedbackIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
        </div>
      </div>
    </FeedbackFish>
  </div>
)

export default FeedbackBubble
