

# S3MusicLibrary 

## What is it?

This module helps you turn an S3 bucket into a music library. It provides a convenient API for querying your music data. 

## Example Usage

```
const S3MusicLibrary = require("s3-music-library")

const musicLibrary = new S3MusicLibrary(
    AWS_S3_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
)

musicLibrary.fetchData()
    .then(() => {
        console.log(musicLibrary.filter({
            artist: "Artist1"
        }))
    })
```

## Setup

First and foremost, you should have an S3 bucket with music data organized in folders according to the following format: `s3://[artist]/[album]/[track.(mp3|flac)]`. 

To install the module, execute `npm install --save s3-music-library`.

Require it at the top of your file, e.g. `const S3MusicLibrary = require("s3-music-library")`.

Instantiate a new S3MusicLibrary instance with the following code:

```
const s3MusicLibrary = new S3MusicLibrary(
  AWS_S3_BUCKET, 
  AWS_ACCESS_KEY_ID, 
  AWS_SECRET_ACCESS_KEY
)
```

Source these variables from `.env` or however you'd like. Always keep them secret and never expose them to the client.

## API

### .fetchData()

You'll need to fetch data from your S3 bucket before doing anything else. Because this request is asynchronous, your data queries will fall within a `.then()` callback function. 

`fetchData` calls `_initializeStore`, which, in turn, calls `_parseListFormat` and `_parseAlbumFormat`. These methods populates the  `s3MusicLibrary` object's `store` with your music data in `listFormat` and `albumFormat`. 

### .filter(queryObject)

This method call's the lodash `_.find` method on the library instance's `_store.albumFormat`. Its result set only contains exact matches.

Example usage: 

```
s3MusicLibrary.filter({
  artist: "Artist1"
})`
```

### .search(key)

This method compares a string search key against all URLs in the instance's `_store.listFormat`.

```
s3MusicLibrary.search("artist1")`
```

## Store

After the raw data is retrieved from S3, it's parsed and saved in the S3MusicLibrary object's store.

### ._store.listFormat

This returns a list of every track in your bucket, structured as follows:

```
{
    url: "Artist1/Album1/Track1.mp3"
    artist: "Artist1",
    album: "Album1",
    track: "Track1.mp3"
}
```

### ._store.albumFormat

This returns a list of albums structured as follows: 

```
{ 
    artist: "Artist1",
    album: "Album1",
    tracks: [
        { title: "Track1", url: "Artist1/Album1/Track1.mp3" },
        { title: "Track2", url: "Artist1/Album1/Track2.mp3" },
        { title: "Track3", url: "Artist1/Album1/Track3.mp3" },
    ],
}
```
### ._store.artistFormat

This returns a list of artists structured as follows: 

```
{ 
    artist: "Artist1",
    albums:[ 
        {
            artist: "Artist1"
            album: "Album1",
            tracks: [
                { title: "Track1", url: "Artist1/Album1/Track1.mp3" },
                { title: "Track2", url: "Artist1/Album1/Track2.mp3" },
                { title: "Track3", url: "Artist1/Album1/Track3.mp3" },
            ]
        },
        {
            artist: "Artist1"
            album: "Album2",
            tracks: [
                { title: "Track1", url: "Artist1/Album2/Track1.mp3" },
                { title: "Track2", url: "Artist1/Album2/Track2.mp3" },
                { title: "Track3", url: "Artist1/Album2/Track3.mp3" },
            ]
        },
    ]
}
```

In general, it's better to access data in the object's store through its getters. These are detailed below.

## Getters

Note that these aren't method calls. The following are getters that retreive/filter data from the object's store.  

```
.artists
```

Returns a list of artists in your library.

```
.albums
```

Returns a list of albums in your library, equivalent to `._store.albumFormat`.

```
.tracks
```

Returns a list of tracks in your library, equivalent to `._store.listFormat`.
