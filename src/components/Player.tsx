import React, { useEffect, useRef, useState } from 'react'
import { Button, ConfigProvider, Drawer, Flex, List, Slider } from 'antd'
import {
  CaretRightOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  MenuOutlined,
  PauseOutlined,
} from '@ant-design/icons'
import useStore from '../store/useStore'
import { formatTime } from '../utils/formatTime'
import Icons from './Icons'
import _ from 'lodash'
import styles from './FullPlayer.module.css'
import useColorThief from 'use-color-thief'
import { useRouter } from 'next/navigation'

const Player = () => {
  const router = useRouter()
  const { singleList, currentId, setCurrentId, isPlaying, setIsPlaying } =
    useStore()
  const [currentSongIndex, setCurrentSongIndex] = useState(
    singleList.findIndex((song) => song.id === currentId)
  )
  const [currentTime, setCurrentTime] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const audioRef = useRef(null)
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play()
    }
  }, [currentSongIndex])
  useEffect(() => {
    const index = singleList.findIndex((song) => song.id === currentId)
    setCurrentSongIndex(index >= 0 ? index : 0)
    console.log('index', index)
  }, [singleList, currentId])

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
        if (handled.current === false) {
          setSliderValue(audioRef.current.currentTime) // 实时更新滑块值
        }
      }
    }

    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? singleList.length - 1 : prevIndex - 1
      setCurrentId(singleList[newIndex].id) // 使用新索引设置 ID
      return newIndex // 返回新索引
    })
    setIsPlaying(true)
  }

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => {
      const newIndex = prevIndex === singleList.length - 1 ? 0 : prevIndex + 1
      setCurrentId(singleList[newIndex].id) // 使用新索引设置 ID
      return newIndex // 返回新索引
    })
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    console.log('isPlaying', isPlaying)
  }
  const handled = useRef(false)
  const handleSliderChange = (value) => {
    handled.current = true
    setSliderValue(value) // 实时更新滑块值
  }

  const handleSliderAfterChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value // 放手后更新播放时间
    }
    handled.current = false
  }

  const currentSong = singleList[currentSongIndex] || {}
  const [volume, setVolume] = useState(100) // 新增音量状态
  const handleVolumeChange = (value) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value / 100 // 设置音量，值需在 0-1 之间
    }
  }
  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.volume == 0) {
        handleVolumeChange(100)
      } else {
        handleVolumeChange(0)
      }
    }
  }
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
  // 播放列表抽屉
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(!open)
  }
  const onClose = () => {
    setOpen(false)
  }
  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  // 全屏模式
  const [fullScreen, setFullScreen] = useState(false)
  const { color, palette } = useColorThief(currentSong.cover, {
    format: 'rgb',
    colorCount: 10,
    quality: 10,
  })
  const gradientStyle = {
    width: '100%',
    height: '100%',
    background: `linear-gradient(to top, 
      rgba(${color}, 0.3) 0%,
      rgba(${palette[0]}, 0.9) 100%`,
  }
  useEffect(() => {
    console.log('palette', palette)
    console.log('color', color)
  }, [palette, color])
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
          <div className={styles.fullPlayerOverlay}>
            <Flex style={gradientStyle} justify="center" align="center">
              <Flex style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <Icons
                  type="icon-xiala"
                  size={24}
                  onClick={() => setFullScreen(false)}
                  rootClassName={styles.closeButton}
                />
              </Flex>
              <Flex className={styles.fullPlayerContent} vertical gap={16}>
                <Flex justify="center">
                  <img src={currentSong.cover} className={styles.img} />
                </Flex>
                <Flex vertical>
                  <span
                    style={{
                      color: ' #f3f2f4',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {currentSong.song_title}
                  </span>
                  <Flex>
                    <span
                      style={{
                        color: ' #c6c2ca',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      <span
                        onClick={() => {
                          router.push(`/artist/${currentSong.artists_id}`),
                            setFullScreen(false)
                        }}
                        className="link"
                      >
                        {currentSong.name}
                      </span>
                      <span> — </span>
                      <span
                        className="link"
                        onClick={() => {
                          router.push(`/album/${currentSong.albums_id}`),
                            setFullScreen(false)
                        }}
                      >
                        {currentSong.album_title === currentSong.song_title
                          ? currentSong.album_title + ' - Single'
                          : currentSong.album_title}
                      </span>
                    </span>
                  </Flex>
                </Flex>
                <Flex vertical>
                  <Slider
                    min={0}
                    max={currentSong.duration || 0}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onChangeComplete={handleSliderAfterChange}
                    tooltip={{ open: false }}
                  />
                  <Flex justify="space-between">
                    <span
                      style={{
                        color: ' #bab5bf',
                      }}
                    >
                      {formatTime(currentTime)}
                    </span>
                    <span
                      style={{
                        color: ' #bab5bf',
                      }}
                    >
                      {formatTime(currentSong.duration)}
                    </span>
                  </Flex>
                </Flex>

                <Flex gap={24} justify="center">
                  <Button
                    size="large"
                    type="text"
                    icon={
                      <StepBackwardOutlined
                        className={styles.moveButton}
                        style={{ fontSize: '32px' }}
                      />
                    }
                    onClick={handlePrevious}
                  />
                  <Button
                    size="large"
                    type="text"
                    onClick={togglePlayPause}
                    style={{ margin: '0 10px', borderRadius: '50%' }}
                    icon={
                      isPlaying ? (
                        <PauseOutlined
                          className={styles.playButton}
                          style={{ fontSize: '48px' }}
                        />
                      ) : (
                        <CaretRightOutlined
                          className={styles.playButton}
                          style={{ fontSize: '48px' }}
                        />
                      )
                    }
                  />
                  <Button
                    size="large"
                    type="text"
                    icon={
                      <StepForwardOutlined
                        className={styles.moveButton}
                        style={{ fontSize: '32px' }}
                      />
                    }
                    onClick={handleNext}
                  />
                </Flex>
                <Flex gap={8}>
                  {getVolumeIcon('2')}
                  <Slider
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleVolumeChange} // 处理音量变化
                  />
                </Flex>
              </Flex>
            </Flex>
          </div>
        </ConfigProvider>
      )}
      <Flex
        align="center"
        justify="space-between"
        style={{ position: 'relative', padding: '10px 40px' }}
      >
        <Flex gap={24} justify="center" align="center">
          <div className="image-container" onClick={() => setFullScreen(true)}>
            <img
              className="cover"
              src={currentSong.cover}
              alt={currentSong.song_title}
              style={{ width: '60px', height: '60px', borderRadius: '8px' }}
            />
            <div className="overlay">
              <Icons
                type="icon-zhankaiquanpingkuozhan"
                size={24}
                rootClassName="overlay-icon"
                color="#fff"
              ></Icons>
            </div>
          </div>
          <Flex
            vertical
            justify="center"
            gap={8}
            style={{
              maxWidth: '250px',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {currentSong.song_title}
            </span>
            <span
              className="link"
              onClick={() => router.push(`/artist/${currentSong.artists_id}`)}
            >
              {currentSong.name}
            </span>
          </Flex>
        </Flex>
        <Flex
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
          }}
          vertical
        >
          <Flex gap={24} justify="center" style={{ paddingTop: '15px' }}>
            <Button
              size="large"
              type="text"
              icon={<StepBackwardOutlined style={{ fontSize: '24px' }} />}
              onClick={handlePrevious}
            />
            <Button
              size="large"
              type="text"
              onClick={togglePlayPause}
              style={{ margin: '0 10px', borderRadius: '50%' }}
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
              icon={<StepForwardOutlined style={{ fontSize: '24px' }} />}
              onClick={handleNext}
            />
          </Flex>
          <Flex align="center" gap={12}>
            <span>{formatTime(currentTime)}</span>
            <Slider
              style={{
                width: '800px',
              }}
              min={0}
              max={currentSong.duration || 0}
              value={sliderValue} // 使用 sliderValue
              onChange={handleSliderChange} // 实时更新值
              onChangeComplete={handleSliderAfterChange} // 放手后更新播放进度
              tooltip={{ open: false }}
            />
            <span>{formatTime(currentSong.duration)}</span>
          </Flex>
        </Flex>
        <Flex gap={24} align="center">
          <Flex gap={8}>
            {getVolumeIcon('1')}
            <Slider
              style={{ width: '100px' }}
              min={0}
              max={100}
              value={volume}
              onChange={handleVolumeChange} // 处理音量变化
            />
          </Flex>
          <span style={{ position: 'relative', top: '-2px', color: '#e5e6eb' }}>
            |
          </span>
          <MenuOutlined onClick={showDrawer} />
        </Flex>
      </Flex>
      <Drawer
        style={{ padding: '0 !important' }}
        title="播放列表"
        onClose={onClose}
        open={open}
        width={320}
        maskClassName="ant-mask"
        rootStyle={{ marginTop: '64px', marginBottom: '81px' }}
      >
        <List
          dataSource={singleList}
          renderItem={(item) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '0px 8px',
                marginBottom: '8px',
              }}
              className={`item ${onClicked == item.id ? 'clicked' : ''}`}
              onClick={() => {
                setCurrentId(item.id)
                setOnClicked(item.id)
                setIsPlaying(true)
              }}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={item.cover}
                    style={{
                      position: 'relative',
                      top: '4px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                    }}
                  ></img>
                }
                title={item.song_title}
                description={item.name}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <div>{formatTime(item.duration)}</div>
            </List.Item>
          )}
        />
      </Drawer>
      <audio
        ref={audioRef}
        src={currentSong.file_path}
        onEnded={handleNext}
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
