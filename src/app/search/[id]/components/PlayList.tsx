'use client'
import React, { FC } from 'react'
import { FaPlayCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import type { PlayList_ } from '../page'
import Image from 'next/image'
type PlayListProps = {
  playList: PlayList_[]
}

const PlayList: FC<PlayListProps> = ({ playList }) => {
  const route = useRouter()

  return (
    <div className="flex flex-wrap gap-6">
      {playList.map((item) => (
        <div
          key={item.id}
          className="group relative w-48 cursor-pointer rounded-lg p-3 transition-transform hover:bg-white hover:shadow-lg"
          onClick={() => route.push(`/playlist/${item.id}`)}
        >
          <div className="relative">
            <Image
              src={item.img}
              alt={item.name}
              width={168}
              height={168}
              className="h-auto w-full rounded-lg"
            />
            <div className="absolute inset-0 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <FaPlayCircle className="absolute bottom-6 right-4 translate-y-4 transform text-4xl text-gray-100 shadow-sm transition-transform duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:transition-transform group-hover:duration-150" />
            </div>
          </div>
          <div className="pt-4">
            <h4 className="font-semibold">{item.name}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayList
