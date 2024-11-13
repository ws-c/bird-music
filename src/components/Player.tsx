import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Drawer, Flex, List, Slider } from 'antd'
import {
  CaretRightOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  MenuOutlined,
  PauseOutlined,
} from '@ant-design/icons'
import useStore from '../store/useStore'
import { formatTime } from '../lib/formatTime'
import Icons from './Icons'
import _ from 'lodash'
import styles from './SingleList.module.css'
const Player = () => {
  const { singleList, currentId, setCurrentId, isPlaying, setIsPlaying } =
    useStore()
  console.log(isPlaying)
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
  const getVolumeIcon = () => {
    if (audioRef.current) {
      const volumeLevel = audioRef.current.volume
      if (volumeLevel === 0) {
        return <Icons type="icon-volume-mute" size={16} onClick={toggleMute} />
      } else if (volumeLevel < 0.5) {
        return <Icons type="icon-volume-small" size={16} onClick={toggleMute} />
      } else {
        return (
          <Icons type="icon-volume-notice" size={16} onClick={toggleMute} />
        )
      }
    }
  }
  // 抽屉
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
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{ position: 'relative', padding: '10px 40px' }}
    >
      <Flex gap={24} justify="center" align="center">
        <div className="image-container">
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
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
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
          {getVolumeIcon()}
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
    </Flex>
  )
}

export default Player
