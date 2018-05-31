const _ = require("lodash")

class S3MusicLibrary {
  constructor(AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) {
    this.AWS_S3_BUCKET = AWS_S3_BUCKET
    this.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID
    this.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY
    this.AWS = require("aws-sdk")
    this.AWS.config.credentials.accessKeyId = AWS_ACCESS_KEY_ID
    this.AWS.config.credentials.secretAccessKey = AWS_SECRET_ACCESS_KEY
    this.s3 = new this.AWS.S3()
    this.data = {}
  }

  async fetchData() {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      MaxKeys: 2147483647
    }
    const response = await this.s3.listObjectsV2(params).promise()
    this.parseAndSetData(response)
  }

  parseAndSetData(response) {
    this.data.raw = response.Contents.filter(
      datum => datum.Key.includes(".mp3") || datum.Key.includes(".flac")
    )

    this.data.structured = response.Contents.map(datum => ({
        url: datum.Key,
        artist: datum.Key.split("/")[0],
        album: datum.Key.split("/")[1],
        track: datum.Key.split("/")[2]
    })).filter(item => (
      item.url.includes(".mp3") || 
      item.url.includes(".flac")
    ))

    this.data.urls = this.data.raw.map(datum => datum.Key)

    this.data.artists = _.uniq(
      this.data.raw.map(datum => datum.Key.split("/")[0])
    )

    this.data.albums = _
      .uniq(this.data.raw.map(datum => datum.Key.split("/")[1]))
      .filter(album => album.length > 0)
  }

  get structuredData() {
    return this.data.structured
  }

  get urls() {
    return this.data.urls
  }

  get artists() {
    return this.data.artists
  }

  get albums() {
    return this.data.albums
  }


  albumsBy(artist) {
    return _.uniqBy(this.data.structured, item => item.album)
      .filter(item => item.artist === artist)
      .map(item => ({
        artist: item.artist, 
        album: item.album,
        tracks: this.data.structured
          .filter(datum => datum.album === item.album)
          .map(track => ({
            title: track.track,
            url: track.url
          }))
      }))
  }

  tracksOn(album) {
    return this.data.structured
      .filter(item => item.album === album)
  }

}

module.exports = S3MusicLibrary