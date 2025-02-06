'use client'
import React, { FC } from 'react'
import { FaPlayCircle } from 'react-icons/fa'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import type { AlbumList_ } from '../page'

type AlbumListProps = {
  albumList: AlbumList_[]
}

const AlbumList: FC<AlbumListProps> = ({ albumList }) => {
  const route = useRouter()

  return (
    <div className="flex flex-wrap gap-6">
      {albumList.map((item) => (
        <div
          key={item.id}
          className="group relative w-48 cursor-pointer rounded-lg p-3 transition-transform hover:bg-white hover:shadow-lg"
          onClick={() => route.push(`/album/${item.id}`)}
        >
          <div className="relative">
            <img
              src={item.cover}
              alt={item.album_title}
              className="h-auto w-full rounded-lg"
            />
            <div className="absolute inset-0 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <FaPlayCircle className="absolute bottom-6 right-4 translate-y-4 transform text-4xl text-gray-100 shadow-sm transition-transform duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:transition-transform group-hover:duration-150" />
            </div>
          </div>
          <div className="pt-4">
            <h4 className="font-semibold">{item.album_title}</h4>
            <span className="text-sm text-gray-600">{item.artists.name}</span>
            <p className="text-sm text-gray-400">
              {dayjs(item.release_date).format('YYYY年MM月DD日')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlbumList
