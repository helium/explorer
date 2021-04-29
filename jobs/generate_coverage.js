const { fetchCoverage } = require('../commonjs/coverage')
const { s3 } = require('./aws')

const uploadFile = (name, content) => {
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: 'helium-explorer',
        Key: `coverage/${name}`,
        Body: content,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data)
      },
    )
  })
}

const generateCoverage = async () => {
  const coverage = await fetchCoverage()
  const now = Date.now()
  await uploadFile(`coverage-${now}.geojson`, JSON.stringify(coverage))

  return process.exit(0)
}

generateCoverage()
