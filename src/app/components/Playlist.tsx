'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlayCircle } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'

type Playlist = {
  author: string
  createTime: string
  desc: string
  id: number
  img: string
  isPrivate: string
  name: string
  tags: null
}

const Playlist = () => {
  const router = useRouter()
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/api/home/playlist')
        const data = await response.json()
        setPlaylists(data)
      } catch (error) {
        console.error('Error fetching playlists:', error)
      }
    }
    fetchPlaylists()
  }, [])

  return (
    <div className="flex gap-4">
      {playlists.length > 0 ? (
        playlists.map((item) => (
          <div
            key={item.id}
            className="group relative w-[200px] flex-shrink-0 transform cursor-pointer overflow-hidden rounded-lg p-2 transition-transform hover:bg-slate-50 hover:shadow-md"
            onClick={() => router.push(`/playlist/${item.id}`)}
          >
            <div className="absolute inset-0 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <FaPlayCircle className="absolute bottom-14 right-4 translate-y-4 transform text-4xl text-gray-100 shadow-sm transition-transform duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:transition-transform group-hover:duration-150" />
            </div>
            <img
              src={item.img}
              alt={item.name}
              className="h-auto w-full rounded-lg object-cover"
            />
            <div className="py-2">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
            </div>
          </div>
        ))
      ) : (
        <div className="flex gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="w-[200px]">
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

export default Playlist
