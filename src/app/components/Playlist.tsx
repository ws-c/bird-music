'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlayCircle } from 'react-icons/fa'

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
    <div className="relative right-2.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {playlists.map((item) => (
        <div
          key={item.id}
          className="group relative transform cursor-pointer overflow-hidden rounded-lg p-2 transition-transform hover:bg-slate-50 hover:shadow-md"
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
            <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Playlist
