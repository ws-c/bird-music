import React, { useEffect, useState } from 'react'
import { Dropdown, MenuProps } from 'antd'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import { SongList } from '@/types'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { IoEllipsisHorizontalSharp } from 'react-icons/io5'
import { Skeleton } from '@/components/ui/skeleton'

const SingleList = () => {
  const {
    isPlaying,
    setIsPlaying,
    setSingleList,
    setCurrentId,
    currentId,
    setShowPlayer,
  } = useStore()

  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
  const [onClicked, setOnClicked] = useState(0)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch('/api/home/singleList')
        const data = await response.json()
        setCurSingleList(data)
      } catch (error) {
        console.error('Error fetching SingleList:', error)
      }
    }

    fetchPlaylist()
  }, [])

  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])

  // 分组函数，每4个元素一组
  const chunkedItems = (arr: SongList[], chunkSize: number) => {
    const result = []
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize))
    }
    return result
  }

  return (
    <div>
      {curSingleList.length > 0 &&
        chunkedItems(curSingleList, 4).map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4 flex gap-4">
            {group.map((item) => {
              const menuItems: MenuProps['items'] = [
                {
                  key: '1',
                  label: <span>分享</span>,
                },
              ]

              return (
                <div
                  key={item.id}
                  className={`group relative flex w-[362px] flex-shrink-0 cursor-pointer items-center justify-between rounded-lg p-2 ${
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
                    if (currentId === item.id) {
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
                      <Dropdown
                        menu={{ items: menuItems }}
                        placement="topLeft"
                        arrow
                      >
                        <IoEllipsisHorizontalSharp />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      {!curSingleList.length && (
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton className="h-[50px] w-[362px] rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SingleList
