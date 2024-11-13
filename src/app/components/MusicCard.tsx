import React, { useEffect, useState } from 'react'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from './MusicCard.module.css' // 引入 CSS Module
import { Flex, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
const MusicCard = () => {
  const router = useRouter()
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const fetchAlbums = async () => {
      NProgress.start()
      try {
        const response = await fetch('/api/album')
        const data = await response.json()
        setAlbums(data)
        console.log('data', data)
      } catch (error) {
        console.error('Error fetching albums:', error)
      } finally {
        NProgress.done()
      }
    }
    fetchAlbums()
  }, [])

  return (
    <Flex gap={24}>
      {albums.map((item) => {
        return (
          <div
            className={styles.musicCard}
            key={item.id}
            onClick={() => router.push(`/album/${item.id}`)}
          >
            <div className={styles.cardCover}>
              <img
                alt="example"
                src={item.cover}
                style={{
                  objectFit: 'cover',
                  height: 270,
                  width: '100%',
                  filter: 'brightness(0.95)',
                }}
              />
              <div className={styles.overlay}>
                <PlayCircleOutlined className={styles.playIcon} />
              </div>
              <Flex>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 35,
                    left: 15,
                    color: 'white',
                    textShadow: '0px 0px 5px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {item.album_title}
                </div>
                <Typography.Text className={styles.title}>
                  {item.desc}
                </Typography.Text>
              </Flex>
            </div>
          </div>
        )
      })}
    </Flex>
  )
}

export default MusicCard
