const S3MusicLibrary = require("./index")
require("dotenv").config()

const {
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env

const s3MusicLibrary = new S3MusicLibrary(
  AWS_S3_BUCKET, 
  AWS_ACCESS_KEY_ID, 
  AWS_SECRET_ACCESS_KEY
)

s3MusicLibrary.fetchData()
  .then(() => {
    // console.log(s3MusicLibrary.artists)
    // console.log(s3MusicLibrary.albums)
    // console.log(s3MusicLibrary.tracks)  
    console.log(s3MusicLibrary.filterBy({ 
      artist: "Enno Velthuys"
    }))
})