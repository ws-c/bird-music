'use client'
import React, { useEffect, useState } from 'react'
import { Flex } from 'antd'
import Icons from './Icons'
import styles from './SingleList.module.css'
import useStore from '../store/useStore'
import { formatTime } from '../lib/formatTime'
const SingleList = () => {
  const { singleList, setSingleList, setCurrentId,currentId, setShowPlayer } = useStore()

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch('/api/singleList')
        const data = await response.json()
        setSingleList(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching SingleList:', error)
      }
    }

    fetchPlaylist()
  }, [setSingleList])
  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <Flex gap={24} wrap={true} style={{ width: '1400px' }}>
      {singleList.map((item) => (
        <Flex
          key={item.id}
          style={{
            width: '425px',
            height: '50px',
            borderBottom: '1px solid #d9d9d9',
            padding: '8px',
            cursor: 'pointer',
          }}
          className={`${styles.item} ${onClicked== item.id ? styles.clicked : ''}`}
          justify="space-between"
          align="center"
          onClick={() => {
            setCurrentId(item.id), setShowPlayer(true), setOnClicked(item.id)
          }}
        >
          <Flex gap={16} align="center">
            <img
              src={item.albums.cover}
              alt=""
              style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            />
            <Flex vertical gap={4}>
              <span>{item.title}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {item.artists.name}
              </span>
            </Flex>
          </Flex>
          <Flex gap={20}>
            <span style={{ fontSize: '14px', color: '#999' }}>
              {formatTime(item.duration)}
            </span>
            <div className={styles.icon}>
              <Icons type="icon-sangediandian1" size={16} />
            </div>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default SingleList
