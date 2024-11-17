'use client'
import React, { FC } from 'react'
import { Flex } from 'antd'
import styles from './AlbumList.module.css'
import { PlayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

type Album = {
  id: number
  release_date: string
  album_title: string
  cover: string
  artists: {
    name: string
  }
}
type AlbumListProps = {
  albumList: Album[]
}
const albumList: FC<AlbumListProps> = ({ albumList }) => {
  const route = useRouter()
  return (
    <Flex gap={24}>
      {albumList.map((item) => (
        <div
          key={item.id}
          className={styles.musicCard}
          onClick={() => route.push(`/album/${item.id}`)}
        >
          <div className={styles.cardCover}>
            <img src={item.cover} className={styles.cardImage} />
          </div>
          <div className={styles.cardInfo}>
            <h4 className={styles.cardTitle}>{item.album_title}</h4>
            <span className={styles.cardDescription}>{item.artists.name}</span>
            <p>{dayjs(item.release_date).format('YYYY年MM月DD日')}</p>
          </div>
          <PlayCircleOutlined className={styles.playIcon} />
        </div>
      ))}
    </Flex>
  )
}

export default albumList
