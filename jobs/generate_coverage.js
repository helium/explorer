const { setCache } = require('../commonjs/redis')
const { getCoverageV2 } = require('../commonjs/coverage')
const fs = require('fs')

const generateCoverage = async () => {
  const coverage = await getCoverageV2()
  fs.writeFileSync('coverage.geojson', JSON.stringify(coverage))
  // await setCache('coverageV2', await getCoverageV2())

  return process.exit(0)
}

generateCoverage()
