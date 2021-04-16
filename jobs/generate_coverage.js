const { setCache } = require('../commonjs/redis')
const { getCoverage } = require('../commonjs/coverage')

const generateCoverage = async () => {
  await setCache('coverage', await getCoverage())

  return process.exit(0)
}

generateCoverage()
