const { getCache } = require('../../commonjs/redis')
const { getCoverage } = require('../../commonjs/coverage')

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
