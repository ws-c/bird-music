'use client'
import React, { FC } from 'react'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { ArtistList_ } from '../page'

type ArtistProps = {
  artists: ArtistList_[]
}

const ArtistList: FC<ArtistProps> = ({ artists }) => {
  const route = useRouter()

  return (
    <div className="flex flex-wrap gap-6">
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="cursor-pointer"
          onClick={() => route.push(`/artist/${artist.id}`)}
        >
          <div className="flex h-52 w-44 flex-col items-center justify-center rounded-lg p-4 transition-shadow hover:bg-white hover:shadow-xl">
            <div className="text-center">
              <Avatar
                size={150}
                src={artist.image_url}
                icon={<UserOutlined />}
              />
              <h3 className="mt-2 text-lg font-semibold">{artist.name}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArtistList
