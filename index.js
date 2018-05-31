require("dotenv").config()

const AWS = require("aws-sdk")

const {
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env

AWS.config.credentials.accessKeyId = AWS_ACCESS_KEY_ID
AWS.config.credentials.secretAccessKey = AWS_SECRET_ACCESS_KEY

const s3 = new AWS.S3()

const params = {
  Bucket: AWS_S3_BUCKET
}

s3.listObjectsV2(params, function(err, data) {
  if (err) console.log(err)
  else {
    console.log(this)
  }
})