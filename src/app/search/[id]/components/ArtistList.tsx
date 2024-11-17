'use client'
import React, { FC } from 'react'
import { Avatar, Flex } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styles from './ArtistList.module.css'
import { useRouter } from 'next/navigation'

interface Artist {
  id: string
  name: string
  image_url: string
}
type ArtistProps = {
  artists: Artist[]
}
const ArtistList: FC<ArtistProps> = ({ artists }) => {
  const route = useRouter()
  return (
    <Flex gap={32}>
      {artists.map((artist) => (
        <Flex
          key={artist.id}
          onClick={() => route.push(`/artist/${artist.id}`)}
        >
          <div className={styles.card}>
            <div className={styles.artist}>
              <Avatar
                size={150}
                src={artist.image_url}
                icon={<UserOutlined />}
                className={styles.avatar}
              />
              <h3>{artist.name}</h3>
            </div>
          </div>
        </Flex>
      ))}
    </Flex>
  )
}
export default ArtistList
