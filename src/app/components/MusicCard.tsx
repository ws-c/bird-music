import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { FaPlayCircle } from 'react-icons/fa'
export type Song = {
  albums_id: number
  artist_id: number
  duration: number
  file_path: string
  id: number
  song_title: string
  [property: string]: any
}
const MusicCard = () => {
  const router = useRouter()
  const [albums, setAlbums] = useState<Song[]>([])

  useEffect(() => {
    const fetchAlbums = async () => {
      NProgress.start()
      try {
        const response = await fetch('/api/home/album')
        const data = await response.json()
        setAlbums(data)
      } catch (error) {
        console.error('Error fetching albums:', error)
      } finally {
        NProgress.done()
      }
    }
    fetchAlbums()
  }, [])

  return (
    <div className="relative right-2.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {albums.map((item) => (
        <div
          key={item.id}
          className="group relative transform cursor-pointer overflow-hidden rounded-lg p-2 transition-transform hover:bg-slate-50 hover:shadow-md"
          onClick={() => router.push(`/album/${item.id}`)}
        >
          <div className="absolute inset-0 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <FaPlayCircle className="absolute bottom-20 right-4 translate-y-4 transform text-4xl text-gray-100 transition-transform duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:transition-transform group-hover:duration-150" />
          </div>
          <img
            src={item.cover}
            alt={item.album_title}
            className="h-auto w-full rounded-lg object-cover"
          />
          <div className="py-2">
            <h3 className="text-md font-semibold text-gray-800">
              {item.album_title}
            </h3>
            <span className="text-sm text-gray-600">{item.artists.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MusicCard
