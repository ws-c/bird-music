'use client'
import React, { useEffect, useState } from 'react'
import { Flex } from 'antd'
import styles from './Playlist.module.css'
import { PlayCircleOutlined } from '@ant-design/icons'

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
  const [playlist, setPlaylist] = useState<Playlist[]>([])

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch('/api/home/playlist')
        const data = await response.json()
        setPlaylist(data)
      } catch (error) {
        console.error('Error fetching playlist:', error)
      }
    }
    fetchPlaylist()
  }, [])
  return (
    <Flex style={{ minWidth: '1700px' }}>
      {playlist.map((item) => (
        <div key={item.id} className={styles.musicCard}>
          <div className={styles.overlay}>
            <PlayCircleOutlined className={styles.playIcon} />
          </div>
          <div className={styles.cardCover}>
            <img alt={item.name} src={item.img} className={styles.cardImage} />
          </div>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>{item.name}</h3>
            {/* <p className={styles.cardDescription}>{item.tag}</p> */}
          </div>
        </div>
      ))}
    </Flex>
  )
}

export default Playlist
