import React, { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import { SongList } from '@/types'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

const SingleList = () => {
  const nav = useRouter()
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
              return (
                <div
                  key={item.id}
                  className={`group relative flex w-[353px] flex-shrink-0 cursor-pointer items-center justify-between rounded-lg p-2 ${
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
                      className="h-10 w-10 rounded-lg group-hover:brightness-75"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-900 dark:text-gray-100">
                        {item.song_title}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.song_artists?.map((artist, index, self) => (
                          <span key={index}>
                            <span
                              className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-xs hover:text-primary hover:underline"
                              onClick={(e) => {
                                if (artist?.artist_id) {
                                  nav.push(`/artist/${artist.artist_id}`)
                                }
                                e.stopPropagation()
                              }}
                            >
                              {artist.artists?.name || 'Unknown Artist'}
                            </span>
                            <span>{index !== self.length - 1 && ' / '}</span>
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(item.duration)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      {!curSingleList.length && (
        <>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-[56px] w-[353px] rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-[56px] w-[353px] rounded-lg" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SingleList
