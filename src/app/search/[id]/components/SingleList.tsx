'use client'
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Flex, MenuProps } from 'antd'
import styles from './SingleList.module.css'
import Link from 'next/link'
import useStore from '../../../../store/useStore'
import { formatTime } from '../../../../utils/formatTime'
import Icons from '../../../../components/Icons'

const SingleList = ({ curSingleList }) => {
  const {
    isPlaying,
    setIsPlaying,
    setSingleList,
    setCurrentId,
    currentId,
    setShowPlayer,
  } = useStore()

  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <Flex gap={24} wrap={true}>
      {curSingleList.map((item) => {
        const menuItems: MenuProps['items'] = [
          {
            key: '1',
            label: <Link href={`/artist/${item.artists_id}`}>查看艺人</Link>,
          },
          {
            key: '2',
            label: <span>分享</span>,
          },
        ]

        return (
          <Flex
            key={item.id}
            style={{
              width: '425px',
              borderBottom: '1px solid #d9d9d9',
              padding: '8px',
              cursor: 'pointer',
            }}
            className={`${styles.listItem} ${
              onClicked == item.id
                ? isPlaying
                  ? styles.clicked
                  : styles.clicked2
                : ''
            }`}
            justify="space-between"
            align="center"
            onClick={() => {
              setSingleList(curSingleList)
              setCurrentId(item.id)
              setOnClicked(item.id)
              setShowPlayer(true)
              if (currentId == item.id) {
                setIsPlaying(!isPlaying)
              } else {
                setIsPlaying(true)
              }
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
            <Flex gap={20} align="center">
              <span style={{ fontSize: '14px', color: '#999' }}>
                {formatTime(item.duration)}
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown menu={{ items: menuItems }} placement="topLeft" arrow>
                  <Button
                    type="text"
                    icon={<Icons type="icon-sangediandian1" size={20} />}
                  ></Button>
                </Dropdown>
              </div>
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}

export default SingleList