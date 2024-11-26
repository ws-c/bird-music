export type SongList = {
  album_title: string
  albums_id: number
  cover: string
  duration: number
  file_path: string
  id: number
  song_artists: SongArtist[]
  song_title: string
  name?: string
  [property: string]: any
}

type SongArtist = {
  artist_id: number
  artists: Artists
  [property: string]: any
}

type Artists = {
  name: string
  [property: string]: any
}
