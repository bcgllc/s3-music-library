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
  }

  async fetchData() {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      MaxKeys: 2147483647
    }
    const response = await this.s3.listObjectsV2(params).promise()
    this._initializeStore(response)
  }

  _initializeStore(response) {
    this._store = {}    
    this._store.listFormat = this._parseListFormat(response)
    this._store.albumFormat = this._parseAlbumFormat()
  }

  _parseListFormat(response) {
    return response.Contents.map(datum => ({
      url: datum.Key,
      artist: datum.Key.split("/")[0],
      album: datum.Key.split("/")[1],
      track: datum.Key.split("/")[2]
    })).filter(item => (
      item.url.includes(".mp3") || 
      item.url.includes(".flac")
    ))
  }

  _parseAlbumFormat() {
    const nodesListFormat = this._store.listFormat
    return _
      .uniqBy(nodesListFormat, listNode => listNode.album)
        .map(listNode => ({
          artist: listNode.artist,
          album: listNode.album,
          tracks: nodesListFormat
            .filter(listNode2 => {
              return listNode.album === listNode2.album
            })
            .map(track => ({
              title: track.track,
              url: track.url
            }))
        }))
  }

  filterBy(queryObject) {
    return _.filter(this._store.albumFormat, queryObject)
  }

  get artists() {
    return _
      .uniqBy(this._store.albumFormat, albumNode => albumNode.artist)
        .map(uniqAlbumNode => ({
          artist: uniqAlbumNode.artist
        }))
  }

  get albums() {
    return this._store.albumFormat
  }

  get tracks() {
    return this._store.listFormat
  }

}

module.exports = S3MusicLibrary