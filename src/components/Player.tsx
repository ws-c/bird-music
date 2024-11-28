import React, { useEffect, useRef, useState } from 'react'
import { Button, ConfigProvider } from 'antd'
import {
  CaretRightOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PauseOutlined,
} from '@ant-design/icons'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import Icons from './Icons'
import useColorThief from 'use-color-thief'
import { useRouter } from 'next/navigation'
import PlayDrawer from './PlayDrawer'
import PlayDrawerFull from './PlayDrawerFull'
import Collect from './Collect'
import { Slider } from '@/components/ui/slider'

const Player = () => {
  const router = useRouter()
  const { singleList, currentId, setCurrentId, isPlaying, setIsPlaying } =
    useStore()
  const [currentSongIndex, setCurrentSongIndex] = useState(
    singleList.findIndex((song) => song.id === currentId)
  )
  const [currentTime, setCurrentTime] = useState(0)
  const [sliderValue, setSliderValue] = useState([0])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 每次 currentSongIndex 变化时，更新播放状态
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play()
    }
  }, [currentSongIndex, isPlaying])

  // 当 currentId 或 singleList 变化时，更新 currentSongIndex
  useEffect(() => {
    const index = singleList.findIndex((song) => song.id === currentId)
    setCurrentSongIndex(index >= 0 ? index : 0)
  }, [singleList, currentId])
  // 根据 isPlaying 状态播放或暂停
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }
  }, [isPlaying])

  // 定时更新当前时间和滑块值
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
        if (!handled.current) {
          setSliderValue([audioRef.current.currentTime]) // 实时更新滑块值
        }
      }
    }
    const interval = setInterval(updateTime, 1000) // 每秒更新一次
    return () => clearInterval(interval)
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

  // 更新 currentId
  useEffect(() => {
    if (currentSongIndex !== null && singleList[currentSongIndex]) {
      setCurrentId(singleList[currentSongIndex].id)
    }
  }, [currentSongIndex])

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
          <Icons
            type="icon-volume-mute"
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      } else if (volumeLevel < 0.5) {
        return (
          <Icons
            type="icon-volume-small"
            size={16}
            style={{ color: value === '2' ? '#f0ecf1' : undefined }}
            onClick={toggleMute}
          />
        )
      } else {
        return (
          <Icons
            type="icon-volume-notice"
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
    setOnClicked(currentId)
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
    let color = '#1e1e1e'
    if (value === '2') {
      iconSize = 24
      color = '#f0ecf1'
    }
    if (playMode === 1) {
      return (
        <Button
          type="text"
          icon={
            <Icons
              type="icon-liebiaoxunhuan"
              size={iconSize}
              onClick={handlePlayModeChange}
              color={color}
            />
          }
          title="列表播放"
        ></Button>
      )
    } else if (playMode === 2) {
      return (
        <Button
          type="text"
          icon={
            <Icons
              type="icon-suijibofang"
              size={iconSize}
              onClick={handlePlayModeChange}
              color={color}
            />
          }
          title="随机播放"
        ></Button>
      )
    } else {
      return (
        <Button
          type="text"
          icon={
            <Icons
              type="icon-danquxunhuan"
              size={iconSize}
              onClick={handlePlayModeChange}
              color={color}
            />
          }
          title="单曲循环"
        ></Button>
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
  console.log('currentSong.song_artists', currentSong.song_artists)
  return (
    <>
      {fullScreen && (
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                railBg: `rgba(255,255,255, 0.3)`,
                railHoverBg: `rgba(255,255,255, 0.6)`,
              },
            },
          }}
        >
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[998] bg-black">
            <div
              style={{ ...gradientStyle }}
              className="flex items-center justify-center backdrop-blur-[20px]"
            >
              <div className="absolute left-5 top-5">
                <Icons
                  type="icon-xiala"
                  size={24}
                  onClick={() => setFullScreen(false)}
                  color="#fff"
                  className="transform cursor-pointer text-xl text-white transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <div className="flex w-[650px] flex-col gap-4">
                <div className="flex justify-center">
                  <img
                    src={currentSong.cover}
                    className={`duration-400 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] w-[650px] transform transition-transform ${isPlaying ? '' : 'scale-90'} rounded-lg object-cover shadow-[0_4px_10px_rgba(255,255,255,0.04)]`}
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-[#f3f2f4]">
                    {currentSong.song_title}
                  </span>
                  <div>
                    <span className="text-lg font-bold text-[#c6c2ca]">
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
                    min={0}
                    max={currentSong.duration || 0}
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderAfterChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-[#bab5bf]">
                      {formatTime(currentTime)}
                    </span>
                    <span className="text-[#bab5bf]">
                      {formatTime(currentSong.duration)}
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center justify-center gap-4">
                  <div className="absolute right-[70%]">
                    {getPlayModeIcon('2')}
                  </div>
                  <Button
                    size="large"
                    type="text"
                    icon={
                      <StepBackwardOutlined
                        style={{ fontSize: '32px', color: '#dddbde' }}
                      />
                    }
                    onClick={handlePrevious}
                  />
                  <Button
                    size="large"
                    type="text"
                    onClick={togglePlayPause}
                    className="mx-2 rounded-full"
                    icon={
                      isPlaying ? (
                        <PauseOutlined
                          style={{ fontSize: '48px', color: '#fff' }}
                        />
                      ) : (
                        <CaretRightOutlined
                          style={{ fontSize: '48px', color: '#fff' }}
                        />
                      )
                    }
                  />
                  <Button
                    size="large"
                    type="text"
                    icon={
                      <StepForwardOutlined
                        style={{ fontSize: '32px', color: '#dddbde' }}
                      />
                    }
                    onClick={() => handleNext(true)}
                  />
                  <div className="absolute left-[70%]">
                    <Button
                      type="text"
                      title="播放列表"
                      icon={
                        <Icons
                          type="icon-bofangliebiao"
                          size={20}
                          onClick={showDrawer1}
                          color="#f0ecf1"
                        />
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {getVolumeIcon('2')}
                  <Slider
                    className="w-full"
                    min={0}
                    max={100}
                    value={volume}
                    onValueChange={handleVolumeChange} // 处理音量变化
                  />
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      )}
      <div className="relative flex items-center justify-between px-[40px] py-[16px]">
        <div className="flex items-center justify-center gap-[24px]">
          <div
            className="relative h-[60px] w-[60px] cursor-pointer rounded-lg"
            onClick={() => {
              setFullScreen(true)
              onClose()
            }}
          >
            <img
              className="h-full w-full rounded-lg"
              src={currentSong.cover}
              alt={currentSong.song_title}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <Icons
                type="icon-zhankaiquanpingkuozhan"
                size={24}
                style={{ color: '#fff' }}
              ></Icons>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-[8px]">
            <span className="text-[16px] font-bold">
              {currentSong.song_title}
              <Icons
                type="icon-yunyinle-tianjiadao"
                size={14}
                className="relative left-[8px]"
                onClick={showModal2}
              />
            </span>
            <div className="flex gap-[8px]">
              {currentSong.song_artists?.map((artist, index, self) => (
                <span key={index}>
                  <span
                    className="overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
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
        <div className="absolute left-[50%] flex w-[800px] translate-x-[-50%] transform flex-col">
          <div className="flex justify-center gap-[16px] pt-[15px]">
            <Button
              size="large"
              type="text"
              icon={<StepBackwardOutlined style={{ fontSize: '30px' }} />}
              onClick={handlePrevious}
            />
            <Button
              size="large"
              type="text"
              onClick={togglePlayPause}
              className="mx-[8px]"
              icon={
                isPlaying ? (
                  <PauseOutlined style={{ fontSize: '40px' }} />
                ) : (
                  <CaretRightOutlined style={{ fontSize: '40px' }} />
                )
              }
            />
            <Button
              size="large"
              type="text"
              icon={<StepForwardOutlined style={{ fontSize: '30px' }} />}
              onClick={() => handleNext(true)}
            />
          </div>
          <div className="flex items-center gap-[12px]">
            <span>{formatTime(currentTime)}</span>
            <Slider
              style={{
                width: '100%',
              }}
              min={0}
              max={currentSong.duration || 0}
              value={sliderValue} // 使用 sliderValue
              onValueChange={handleSliderChange} // 实时更新值
              onValueCommit={handleSliderAfterChange} // 放手后更新播放进度
            />
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-[24px]">
          {getPlayModeIcon('1')}
          <div className="flex gap-[8px]">
            {getVolumeIcon('1')}
            <Slider
              style={{ width: '100px' }}
              min={0}
              max={100}
              value={volume}
              onValueChange={handleVolumeChange} // 处理音量变化
            />
          </div>
          <span className="relative text-[#e5e6eb]">|</span>
          <Button
            type="text"
            title="播放列表"
            icon={
              <Icons type="icon-bofangliebiao" size={20} onClick={showDrawer} />
            }
          ></Button>
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
        onEnded={() => handleNext(false)}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0 // Reset time when song changes
          }
        }}
      />
    </>
  )
}

export default Player
