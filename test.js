const S3MusicLibrary = require("./index")
require("dotenv").config()

const {
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env

const s3MusicLibrary = new S3MusicLibrary(AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

const f = s3MusicLibrary.fetchData()
f.then(() => {
  // console.log(s3MusicLibrary.store.structuredFormat)
  // console.log(s3MusicLibrary.store.recordFormat)
  // s3MusicLibrary.filterBy({ artist: "Enno Velthuys" })
  console.log(s3MusicLibrary.tracks)

})