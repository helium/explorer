import { FeedbackFish } from '@feedback-fish/react'

const FeedbackBubble = ({ className, children }) => (
  <div className={className}>
    <FeedbackFish projectId={process.env.NEXT_PUBLIC_FEEDBACK_FISH_PROJECT_ID}>
      {children}
    </FeedbackFish>
  </div>
)

export default FeedbackBubble
