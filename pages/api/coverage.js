import { maxBy } from 'lodash'
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-2' })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

export const latestCoverageUrl = () => {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    return 'https://helium-explorer.s3-us-west-2.amazonaws.com/coverage/coverage.geojson'
  }

  return new Promise((resolve, reject) => {
    s3.listObjects(
      { Bucket: 'helium-explorer', Prefix: 'coverage/' },
      (err, data) => {
        if (err) {
          reject(err)
        }

        const file = maxBy(data.Contents, ({ Key }) =>
          parseInt(Key.match(/coverage-(\d+)\.geojson/)?.[1] || 0),
        )

        if (!file) {
          reject('not found')
        }

        const url = `https://helium-explorer.s3-us-west-2.amazonaws.com/${file.Key}`

        resolve(url)
      },
    )
  })
}

export default async function handler(req, res) {
  try {
    const coverageUrl = await latestCoverageUrl()
    res.status(200).send({
      coverageUrl,
    })
  } catch (error) {
    console.error(error)
  }
}
