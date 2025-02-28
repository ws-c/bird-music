'use client'
import React, { FC, useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import type { SingleList_ } from '../page'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type SingleListProps = {
  curSingleList: SingleList_[]
}
const SingleList: FC<SingleListProps> = ({ curSingleList }) => {
  const nav = useRouter()
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
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {curSingleList.map((item) => {
        return (
          <div
            key={item.id}
            className={`group relative flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
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
                className="absolute left-[28px] top-[20px] z-[100] text-white dark:text-gray-300"
              />
            ) : (
              <FaPlayCircle
                size={18}
                className="absolute left-[28px] top-[20px] z-[100] text-white opacity-0 group-hover:opacity-100 dark:text-gray-300"
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
                  {item.song_artists?.map(
                    (
                      artist: { artist_id: any; artists: { name: any } },
                      index: React.Key | null | undefined,
                      self: string | any[]
                    ) => (
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
                    )
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(item.duration)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SingleList
