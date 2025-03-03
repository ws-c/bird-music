import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { FaPlayCircle } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'
import { SongList } from '@/types'

const MusicCard = () => {
  const router = useRouter()
  const [albums, setAlbums] = useState<SongList[]>([])
  NProgress.configure({ showSpinner: false })
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
    <div className="flex gap-2">
      {albums.length > 0 ? (
        albums.map((item) => (
          <div
            key={item.id}
            className="group relative w-[176px] flex-shrink-0 transform cursor-pointer overflow-hidden rounded-lg p-2 transition-transform hover:bg-slate-50 hover:shadow-md"
            onClick={() => router.push(`/album/${item.id}`)}
          >
            <div className="absolute inset-0 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <FaPlayCircle className="absolute right-4 top-[120px] translate-y-4 transform text-4xl text-gray-100 transition-transform duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:transition-transform group-hover:duration-150" />
            </div>
            <img
              src={item.cover}
              alt={item.album_title}
              className="h-auto w-full rounded-lg object-cover"
            />
            <div className="py-2">
              <h3 className="font-semibold text-gray-800">
                {item.album_title}
              </h3>
              <span className="text-sm text-gray-600">{item.artists.name}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-[176px]">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4 rounded" />
              <Skeleton className="mt-1 h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MusicCard
