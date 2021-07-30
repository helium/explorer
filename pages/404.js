import { latestCoverageUrl } from '../commonjs/coverage'
import Index from './index'

const Custom404 = ({ coverageUrl }) => {
  return <Index coverageUrl={coverageUrl} />
}

export async function getStaticProps() {
  const coverageUrl = await latestCoverageUrl()
  return {
    props: { coverageUrl },
    revalidate: 60,
  }
}

export default Custom404
