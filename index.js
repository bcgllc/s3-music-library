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
    this.store = {}
  }

  async fetchData() {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      MaxKeys: 2147483647
    }
    const response = await this.s3.listObjectsV2(params).promise()
    this.initializeStore(response)
  }

  initializeStore(response) {
    this.parseStructuredFormat(response)
    this.parseRecordFormat()
  }

  parseStructuredFormat(response) {
    this.store.structuredFormat = response.Contents.map(datum => ({
      url: datum.Key,
      artist: datum.Key.split("/")[0],
      album: datum.Key.split("/")[1],
      track: datum.Key.split("/")[2]
    })).filter(item => (
      item.url.includes(".mp3") || 
      item.url.includes(".flac")
    ))
  }

  parseRecordFormat() {
    const nodesStructuredFormat = this.store.structuredFormat
    this.store.recordFormat = _
      .uniqBy(nodesStructuredFormat, structuredNode => structuredNode.album)
        .map(structuredNode => ({
          artist: structuredNode.artist,
          album: structuredNode.album,
          tracks: nodesStructuredFormat
            .filter(structuredNode2 => {
              return structuredNode.album === structuredNode2.album
            })
            .map(track => ({
              title: track.track,
              url: track.url
            }))
        }))
  }

  filterBy(queryObject) {
    return _.filter(this.store.recordFormat, queryObject)
  }

  get artists() {
    return _
      .uniqBy(this.store.recordFormat, recordNode => recordNode.artist)
        .map(uniqRecordNode => ({
          artist: uniqRecordNode.artist
        }))
  }

  get albums() {
    return _
      .uniqBy(this.store.recordFormat, recordNode => recordNode.album)
        .map(uniqRecordNode => ({
          artist: uniqRecordNode.artist,
          album: uniqRecordNode.album
        }))
  }

  get tracks() {
    return this.store.structuredFormat
  }

}

module.exports = S3MusicLibrary