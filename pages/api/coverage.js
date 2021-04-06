const { getCache } = require('../../commonjs/redis')
const { emptyCoverage } = require('../../commonjs/coverage')

export default async function handler(req, res) {
  const coverage = await getCache('coverage', emptyCoverage)
  res.status(200).send(coverage)
}
