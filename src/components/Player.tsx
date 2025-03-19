import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineAddBox } from 'react-icons/md'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import Icons from './Icons'
import useColorThief from 'use-color-thief'
import { useRouter } from 'next/navigation'
import PlayDrawer from './PlayDrawer'
import PlayDrawerFull from './PlayDrawerFull'
import Collect from './Collect'
import { Slider } from '@/components/ui/slider'
import { CgPlayList, CgArrowsExpandRight } from 'react-icons/cg'
import {
  IoCaretForwardCircle,
  IoChevronDown,
  IoPauseCircle,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeOff,
} from 'react-icons/io5'
import Lyric from './Lyric'
import { Fetch } from '@/lib/request'
import Image from 'next/image'
const Player = () => {
  const router = useRouter()
  const {
    singleList,
    preSingleList,
    setPreSingleList,
    currentId,
    setCurrentId,
    isPlaying,
    setIsPlaying,
    user,
    isLove,
    setIsLove,
    triggerRefresh,
  } = useStore()
  const [currentSongIndex, setCurrentSongIndex] = useState(
    singleList.findIndex((song) => song.id === currentId)
  ) // 获取当前歌曲数组的索引

  const [currentTime, setCurrentTime] = useState(0)
  const [sliderValue, setSliderValue] = useState([0])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const accumulatedPlayTimeRef = useRef(0) // 累计播放时间(毫秒)
  const hasCountedRef = useRef(false) // 是否已记录
  const playbackStartTimeRef = useRef<number | null>(null) // 播放开始时间
  const playTimerRef = useRef<NodeJS.Timeout | null>(null) // 定时器引用

  // 每次 currentSongIndex 变化时，更新播放状态
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play()
    }
  }, [currentSongIndex, isPlaying, currentId])
  // 当 currentId 或 singleList 变化时，更新 currentSongIndex
  useEffect(() => {
    const index = singleList.findIndex((song) => song.id === currentId) || 0
    setCurrentSongIndex(index)
    // 更新历史播放列表
    const newPreSingleList = [singleList[index], ...preSingleList]
    const uniquePreSingleList = newPreSingleList.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    )
    setPreSingleList(uniquePreSingleList)
  }, [singleList, currentId])
  // 更新 currentId
  useEffect(() => {
    if (currentSongIndex !== null && singleList[currentSongIndex]) {
      setCurrentId(singleList[currentSongIndex].id)
    }
  }, [currentSongIndex])
  // 根据 isPlaying 状态播放或暂停
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
    // 定时更新当前时间和滑块值
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
        if (!handled.current) {
          setSliderValue([audioRef.current.currentTime]) // 实时更新滑块值
        }
      }
    }
    const interval = setInterval(updateTime, 1000) // 每秒更新一次
    // 监听空格键
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault() // 阻止默认的空格滚动行为
        togglePlayPause() // 切换播放状态
      }
    }
    document.addEventListener('keydown', handleKeyPress)

    // 清除事件监听
    return () => {
      clearInterval(interval)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isPlaying])

  // 歌曲历史列表，用于随机播放时的返回功能
  const [historyList, setHistoryList] = useState<number[]>([])

  // 播放上一首
  const handlePrevious = () => {
    if (historyList.length <= 0) {
      setCurrentSongIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? singleList.length - 1 : prevIndex - 1
        setCurrentId(singleList[newIndex].id)
        return newIndex
      })
    } else {
      const newIndex = historyList[historyList.length - 1]
      setCurrentSongIndex(newIndex)
      setHistoryList(historyList.slice(0, -1)) // 移除已播放的歌曲记录
    }
    setIsPlaying(true)
  }

  // 播放下一首
  const handleNext = (isOnclick = false) => {
    if (isOnclick) {
      if (playMode === 1 || playMode === 3) {
        setCurrentSongIndex((prevIndex) => {
          const newIndex =
            prevIndex === singleList.length - 1 ? 0 : prevIndex + 1
          return newIndex
        })
      } else if (playMode === 2) {
        setHistoryList((prev) => [...prev, currentSongIndex])
        const newIndex = Math.floor(Math.random() * singleList.length)
        setCurrentSongIndex(newIndex)
      }
    } else {
      // 自动播放下一首
      if (playMode === 1) {
        setCurrentSongIndex((prevIndex) => {
          const newIndex =
            prevIndex === singleList.length - 1 ? 0 : prevIndex + 1
          return newIndex
        })
      } else if (playMode === 2) {
        const newIndex = Math.floor(Math.random() * singleList.length)
        setCurrentSongIndex(newIndex)
      } else {
        if (!audioRef.current) return
        audioRef.current.currentTime = 0
        audioRef.current?.play()
      }
    }
    setIsPlaying(true)
  }

  // 切换播放状态
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // 控制滑块变化
  const handled = useRef(false)
  const handleSliderChange = (value: React.SetStateAction<number[]>) => {
    handled.current = true
    setSliderValue(value) // 实时更新滑块值
  }

  // 放手后更新音频播放时间
  const handleSliderAfterChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
    }
    handled.current = false
  }

  // 获取当前歌曲
  const currentSong = singleList[currentSongIndex] || {}

  // 音量控制
  const [volume, setVolume] = useState([100])
  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  // 切换静音
  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.volume === 0) {
        handleVolumeChange([100])
      } else {
        handleVolumeChange([0])
      }
    }
  }

  // 根据音量显示不同图标
  const getVolumeIcon = (value: string) => {
    if (audioRef.current) {
      const volumeLevel = audioRef.current.volume
      if (volumeLevel === 0) {
        return (
          <IoVolumeOff
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      } else if (volumeLevel < 0.3) {
        return (
          <IoVolumeLow
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      } else if (volumeLevel < 0.8) {
        return (
          <IoVolumeMedium
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      } else {
        return (
          <IoVolumeHigh
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      }
    }
  }

  // 当前点击的歌曲
  const [onClicked, setOnClicked] = useState(0)
  useEffect(() => {
    getLove()
    setOnClicked(currentId)
    accumulatedPlayTimeRef.current = 0
    hasCountedRef.current = false
    playbackStartTimeRef.current = null
  }, [currentId])

  // 全屏模式
  const [fullScreen, setFullScreen] = useState(false)

  // 获取当前歌曲封面颜色
  const { color, palette } = useColorThief(currentSong.cover, {
    format: 'rgb',
    colorCount: 10,
    quality: 10,
  })

  // 渐变背景样式
  const gradientStyle = {
    width: '100%',
    height: '100%',
    background: `linear-gradient(to top, rgba(${color}, 0.3) 0%, rgba(${palette[1]}, 0.9) 100%)`,
  }

  // 播放模式
  const [playMode, setPlayMode] = useState(1)

  // 切换播放模式
  const handlePlayModeChange = () => {
    if (playMode === 1) {
      setPlayMode(2)
    } else if (playMode === 2) {
      setPlayMode(3)
    } else {
      setPlayMode(1)
    }
  }

  // 获取播放模式图标
  const getPlayModeIcon = (value: string) => {
    let iconSize = 20
    let color
    if (value === '2') {
      iconSize = 24
      color = 'white'
    }
    if (playMode === 1) {
      return (
        <Icons
          type="icon-liebiaoxunhuan"
          size={iconSize}
          onClick={handlePlayModeChange}
          title="列表播放"
          color={color}
        />
      )
    } else if (playMode === 2) {
      return (
        <Icons
          type="icon-suijibofang"
          size={iconSize}
          onClick={handlePlayModeChange}
          title="随机播放"
          color={color}
        />
      )
    } else {
      return (
        <Icons
          type="icon-danquxunhuan"
          size={iconSize}
          onClick={handlePlayModeChange}
          title="单曲循环"
          color={color}
        />
      )
    }
  }

  // 播放列表抽屉
  const [open, setOpen] = useState<boolean>(false)
  const showDrawer = () => setOpen(!open)
  const onClose = () => setOpen(false)
  // 播放列表抽屉全屏版
  const [open1, setOpen1] = useState<boolean>(false)
  const showDrawer1 = () => setOpen1(!open)
  const onClose1 = () => setOpen1(false)

  //收藏对话框
  const [open2, setOpen2] = useState(false)
  const showModal2 = () => {
    setOpen2(true)
  }

  // 喜欢歌曲
  const handleLove = async () => {
    const res = await Fetch('/api/love', {
      method: 'POST',
      body: {
        song_id: currentId,
        user_id: user.id,
      },
    })

    setIsLove(res.value)
    triggerRefresh()
  }
  const getLove = async () => {
    const res = await Fetch('/api/love/get', {
      method: 'POST',
      body: {
        song_id: currentId,
        user_id: user.id,
      },
    })

    setIsLove(res.value)
  }

  // 播放量记录方法
  const recordPlayCount = async () => {
    await Fetch('/api/play-count', {
      method: 'POST',
      body: {
        id: currentId,
      },
    })
  }

  // 时间检查方法
  const checkPlayCount = () => {
    if (accumulatedPlayTimeRef.current >= 30000 && !hasCountedRef.current) {
      recordPlayCount()
      hasCountedRef.current = true
    }
  }
  // 新增清理定时器函数
  const clearPlayTimer = () => {
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current)
      playTimerRef.current = null
    }
  }

  // 在useEffect清理函数中添加
  useEffect(() => {
    return () => {
      clearPlayTimer()
    }
  }, [])

  return (
    <div className="fixed bottom-0 z-[1000] w-full border-t bg-[#fafafa] p-0 dark:bg-[#000]">
      {/* 全屏模式 */}
      {fullScreen && (
        <div className="fixed inset-0 z-[998] bg-black">
          <div className="absolute left-5 top-5">
            <IoChevronDown
              size={24}
              onClick={() => setFullScreen(false)}
              className="transform cursor-pointer text-xl text-white transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
          <div
            style={{ ...gradientStyle, paddingLeft: '15%' }}
            className="flex items-center gap-40"
          >
            <div className="flex w-[450px] flex-col gap-4 pt-20">
              <div className="flex justify-center">
                <Image
                  src={currentSong.cover}
                  alt="歌曲封面"
                  width={400}
                  height={400}
                  className={`transform transition-transform duration-300 ${isPlaying ? '' : 'scale-90'} shadow-inset rounded-lg object-cover`}
                />
              </div>
              <div>
                <span className="text-lg font-bold text-[#f3f2f4]">
                  {currentSong.song_title}
                  <Icons
                    type={isLove ? 'icon-heart-fill' : 'icon-heart'}
                    size={20}
                    className={`ml-2 ${isLove ? '' : 'hover:text-primary'}`}
                    onClick={handleLove}
                  />
                </span>
                <div>
                  <span className="text-base font-bold text-[#c6c2ca]">
                    {currentSong.song_artists?.map((artist, index, self) => (
                      <span key={index}>
                        <span
                          className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                          onClick={() => {
                            if (artist?.artist_id) {
                              router.push(`/artist/${artist.artist_id}`)
                              setFullScreen(false)
                            }
                          }}
                        >
                          {artist.artists?.name || 'Unknown Artist'}
                        </span>
                        <span>{index !== self.length - 1 && ' / '}</span>
                      </span>
                    ))}
                    <span> — </span>
                    <span
                      className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                      onClick={() => {
                        router.push(`/album/${currentSong.albums_id}`)
                        setFullScreen(false)
                      }}
                    >
                      {currentSong.album_title === currentSong.song_title
                        ? currentSong.album_title + ' - Single'
                        : currentSong.album_title}
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <Slider
                  className="dark"
                  min={0}
                  max={currentSong.duration || 0}
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  onValueCommit={handleSliderAfterChange}
                />
                <div className="flex justify-between pt-1">
                  <span className="text-[#bab5bf]">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-[#bab5bf]">
                    {formatTime(currentSong.duration)}
                  </span>
                </div>
              </div>
              <div className="relative flex items-center justify-center gap-4">
                <div className="mx-2">{getPlayModeIcon('2')}</div>
                <IoPlaySkipBack
                  onClick={handlePrevious}
                  className="cursor-pointer text-3xl text-white"
                />

                {isPlaying ? (
                  <IoPauseCircle
                    onClick={togglePlayPause}
                    className="mx-2 transform cursor-pointer rounded-full text-6xl text-white transition-transform duration-200 hover:scale-110"
                  />
                ) : (
                  <IoCaretForwardCircle
                    onClick={togglePlayPause}
                    className="mx-2 transform cursor-pointer rounded-full text-6xl text-white transition-transform duration-200 hover:scale-110"
                  />
                )}

                <IoPlaySkipForward
                  onClick={() => handleNext(true)}
                  className="cursor-pointer text-3xl text-white"
                />
                <div className="mx-2">
                  <CgPlayList
                    size={24}
                    onClick={showDrawer1}
                    title="播放列表"
                    className="relative top-[2px] cursor-pointer text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {getVolumeIcon('2')}
                <Slider
                  className="dark w-full"
                  min={0}
                  max={100}
                  value={volume}
                  onValueChange={handleVolumeChange} // 处理音量变化
                />
              </div>
            </div>
            {currentSong.lyric ? (
              <Lyric lyricUrl={currentSong.lyric} currentTime={currentTime} />
            ) : (
              <div className="flex h-4/5 w-[720px] overflow-y-auto pt-72">
                <div className="text-xl text-white">纯音乐，请欣赏</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 底部播放器 */}
      <div className="relative flex items-center justify-between px-4 py-4">
        <div className="flex items-center justify-center gap-6">
          <div
            className="relative h-14 w-14 cursor-pointer rounded-lg"
            onClick={() => {
              setFullScreen(true)
              onClose()
            }}
          >
            <Image
              width={56}
              height={56}
              className="h-full w-full rounded-lg shadow-inner"
              src={currentSong.cover}
              alt={currentSong.song_title}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <CgArrowsExpandRight
                size={24}
                style={{ color: '#fff' }}
              ></CgArrowsExpandRight>
            </div>
          </div>
          <div className="flex-col justify-center gap-2">
            <div className="flex text-base font-bold">
              {currentSong.song_title}
              <MdOutlineAddBox
                size={14}
                className="relative left-2 top-1 cursor-pointer"
                onClick={showModal2}
              />
            </div>
            <div className="flex gap-2">
              {currentSong.song_artists?.map((artist, index, self) => (
                <span key={index}>
                  <span
                    className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-xs hover:text-primary hover:underline"
                    onClick={() => {
                      if (artist?.artist_id) {
                        router.push(`/artist/${artist.artist_id}`)
                        setFullScreen(false)
                      }
                    }}
                  >
                    {artist.artists?.name || 'Unknown Artist'}
                  </span>
                  <span>{index !== self.length - 1 && ' / '}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute left-[50%] flex translate-x-[-50%] transform flex-col sm:w-[150px] md:w-[300px] lg:w-[450px] xl:w-[750px]">
          <div className="flex items-center justify-center gap-6 pt-2">
            <Icons
              type={isLove ? 'icon-heart-fill' : 'icon-heart'}
              size={24}
              className={`${isLove ? '' : 'hover:text-primary'}`}
              onClick={handleLove}
            />

            <IoPlaySkipBack
              onClick={handlePrevious}
              className="cursor-pointer text-2xl"
            />

            {isPlaying ? (
              <IoPauseCircle
                onClick={togglePlayPause}
                className="transform cursor-pointer text-5xl text-primary transition-transform duration-200 hover:scale-110"
              />
            ) : (
              <IoCaretForwardCircle
                onClick={togglePlayPause}
                className="transform cursor-pointer text-5xl text-primary transition-transform duration-200 hover:scale-110"
              />
            )}
            <IoPlaySkipForward
              onClick={() => handleNext(true)}
              className="cursor-pointer text-2xl"
            />
            {getPlayModeIcon('1')}
          </div>
          <div className="flex items-center gap-4">
            <span>{formatTime(currentTime)}</span>
            <Slider
              className="w-full"
              min={0}
              max={currentSong.duration || 0}
              value={sliderValue} // 使用 sliderValue
              onValueChange={handleSliderChange} // 实时更新值
              onValueCommit={handleSliderAfterChange} // 放手后更新播放进度
            />
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {getVolumeIcon('1')}
            <Slider
              className="w-24"
              min={0}
              max={100}
              value={volume}
              onValueChange={handleVolumeChange} // 处理音量变化
            />
          </div>
          <div>|</div>
          <CgPlayList
            size={24}
            onClick={showDrawer}
            title="播放列表"
            className="relative top-[2px] cursor-pointer"
          />
        </div>
      </div>
      <PlayDrawer
        open={open}
        onClose={onClose}
        singleList={singleList}
        onClicked={onClicked}
        setOnClicked={setOnClicked}
        setCurrentId={setCurrentId}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
      />
      <PlayDrawerFull
        open={open1}
        onClose={onClose1}
        singleList={singleList}
        onClicked={onClicked}
        setOnClicked={setOnClicked}
        setCurrentId={setCurrentId}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
      />
      <Collect open={open2} setOpen={setOpen2} />
      <audio
        ref={audioRef}
        src={currentSong.file_path}
        onPlay={() => {
          playbackStartTimeRef.current = Date.now()

          // 启动定时检查（每秒检查一次）
          playTimerRef.current = setInterval(() => {
            if (playbackStartTimeRef.current) {
              const now = Date.now()
              const duration = now - playbackStartTimeRef.current
              accumulatedPlayTimeRef.current += duration
              playbackStartTimeRef.current = now // 重置开始时间
              checkPlayCount()
            }
          }, 1000)
        }}
        onPause={() => {
          const now = Date.now()
          if (playbackStartTimeRef.current) {
            const duration = now - playbackStartTimeRef.current
            accumulatedPlayTimeRef.current += duration
            playbackStartTimeRef.current = null
          }
          checkPlayCount()
          clearPlayTimer()
        }}
        onEnded={() => {
          handleNext(false)
          const now = Date.now()
          if (playbackStartTimeRef.current) {
            const duration = now - playbackStartTimeRef.current
            accumulatedPlayTimeRef.current += duration
            playbackStartTimeRef.current = null
          }
          checkPlayCount()
          clearPlayTimer()
        }}
      />
    </div>
  )
}

export default Player
