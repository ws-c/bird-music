'use client'
import React, { useEffect, useState } from 'react'
import { Flex } from 'antd'
import Icons from '../../components/Icons'
import styles from './SingleList.module.css'
import useStore from '../../store/useStore'
import { formatTime } from '../../lib/formatTime'
const SingleList = () => {
  const {
    setIsPlaying,
    setSingleList,
    setCurrentId,
    currentId,
    setShowPlayer,
  } = useStore()
  const [curSingleList, setCurSingleList] = useState([])
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch('/api/singleList')
        const data = await response.json()
        setCurSingleList(data)
        console.log('singleList', data)
      } catch (error) {
        console.error('Error fetching SingleList:', error)
      }
    }

    fetchPlaylist()
  }, [])
  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <Flex gap={24} wrap={true} style={{ width: '1400px' }}>
      {curSingleList.map((item) => (
        <Flex
          key={item.id}
          style={{
            width: '425px',
            height: '50px',
            borderBottom: '1px solid #d9d9d9',
            padding: '8px',
            cursor: 'pointer',
          }}
          className={`item ${onClicked == item.id ? 'clicked' : ''}`}
          justify="space-between"
          align="center"
          onClick={() => {
            setSingleList(curSingleList)
            setCurrentId(item.id)
            setOnClicked(item.id)
            setShowPlayer(true)
            setIsPlaying(true)
          }}
        >
          <Flex gap={16} align="center">
            <img
              src={item.cover}
              alt=""
              style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            />
            <Flex vertical gap={4}>
              <span>{item.song_title}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {item.name}
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
