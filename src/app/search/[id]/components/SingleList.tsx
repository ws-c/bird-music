'use client'
import React, { FC, useEffect, useState } from 'react'
import { Dropdown, Flex, MenuProps } from 'antd'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import type { SingleList_ } from '../page'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { IoEllipsisHorizontalSharp } from 'react-icons/io5'
type SingleListProps = {
  curSingleList: SingleList_[]
}
const SingleList: FC<SingleListProps> = ({ curSingleList }) => {
  const {
    isPlaying,
    setIsPlaying,
    setSingleList,
    setCurrentId,
    currentId,
    setShowPlayer,
  } = useStore()

  const [onClicked, setOnClicked] = useState(0)
  useEffect(() => {
    if (currentId) {
      setOnClicked(currentId)
    }
  }, [currentId])

  return (
    <Flex gap={24} wrap={true}>
      {curSingleList.map((item) => {
        const menuItems: MenuProps['items'] = [
          {
            key: '1',
            label: <span>分享</span>,
          },
        ]

        return (
          <div
            key={item.id}
            className={`group relative flex w-[383px] cursor-pointer items-center justify-between rounded-lg p-2 ${
              onClicked === item.id
                ? isPlaying
                  ? 'bg-gray-200 dark:bg-[#212127]'
                  : 'bg-gray-200 dark:bg-[#212127]'
                : 'bg-white hover:bg-[gray-100] dark:bg-[#121212] dark:hover:bg-[#212127]'
            }`}
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
            {onClicked === item.id && isPlaying ? (
              <FaPauseCircle
                size={18}
                className="absolute left-[20px] top-[20px] z-[100] text-white dark:text-gray-300"
              />
            ) : (
              <FaPlayCircle
                size={18}
                className="absolute left-[20px] top-[20px] z-[100] text-white opacity-0 group-hover:opacity-100 dark:text-gray-300"
              />
            )}

            <div className="flex items-center gap-4">
              <img
                src={item.cover}
                alt=""
                className="h-10 w-10 rounded-lg brightness-100 group-hover:brightness-90"
              />
              <div className="flex flex-col gap-1">
                <span className="text-gray-900 dark:text-gray-100">
                  {item.song_title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(item.duration)}
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown menu={{ items: menuItems }} placement="topLeft" arrow>
                  <IoEllipsisHorizontalSharp />
                </Dropdown>
              </div>
            </div>
          </div>
        )
      })}
    </Flex>
  )
}

export default SingleList
