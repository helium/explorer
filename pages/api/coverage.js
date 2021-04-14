const { getCache } = require('../../commonjs/redis')
const { emptyCoverage } = require('../../commonjs/coverage')

export default async function handler(req, res) {
  const coverage = await getCache('coverageV2', emptyCoverage)
  res.status(200).send(coverage)
}
