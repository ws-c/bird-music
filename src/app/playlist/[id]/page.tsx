'use client'
import { useEffect, useState } from 'react'
import useStore from '../../../store/useStore'
import { formatTime } from '../../../utils/formatTime'
import { useRouter } from 'next/navigation'
import { Spin, Flex, Typography, Button, Table, Avatar } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import flattenObject from '../../../utils/flattenObject'
import { UserOutlined } from '@ant-design/icons'
import Icons from '../../../components/Icons'
import Edit from './Edit'
const columns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: '1%',
    render: (_: any, __: any, index: number) =>
      (index + 1).toString().padStart(2, '0'),
  },
  {
    title: '歌名',
    dataIndex: 'song_title',
    key: 'song_title',
    width: '20%',
  },
  {
    title: '艺人',
    dataIndex: 'name',
    key: 'name',
    width: '15%',
  },
  {
    title: '专辑',
    dataIndex: 'album_title',
    key: 'name',
    width: '15%',
  },

  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    width: '5%',
    render: (text: number) => formatTime(text),
  },
]
export type Playlist = {
  author: string
  createTime: string
  desc: string
  id: number
  img: string
  isPrivate: string
  name: string
  tags: string[]
  cover: string
  [property: string]: any
}

type Songs = {
  albums: Albums
  albums_id: number
  artists: Artists
  artists_id: number
  duration: number
  file_path: string
  id: number
  song_title: string
  [property: string]: any
}

type Albums = {
  album_title: string
  cover: string
  [property: string]: any
}

type Artists = {
  name: string
  [property: string]: any
}

const PlayList = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const {
    user,
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
    refreshCount,
    setColorTheme,
  } = useStore()
  const router = useRouter()

  const [playList, setPlayList] = useState<Playlist>({
    author: '',
    createTime: '',
    desc: '',
    id: 0,
    img: '',
    isPrivate: '',
    name: '',
    tags: [],
    cover: '',
  })
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState<Songs[]>([])
  const [onClicked, setOnClicked] = useState(0)

  useEffect(() => {
    fetchAllData()
  }, [refreshCount])
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [playlistRes, contentRes] = await Promise.all([
        fetch(`/api/playlist/get/${id}`),
        fetch(`/api/playlist_content?id=${id}`),
      ])
      const playlistData = await playlistRes.json()
      const contentData = await contentRes.json()
      setPlayList(playlistData)
      setColorTheme(playlistData.img)
      const flattenedData = contentData.map((item: any) => flattenObject(item))
      setCurSingleList(flattenedData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (currentId) {
      setOnClicked(currentId)
    }
  }, [currentId])
  // 修改歌单信息
  const [open, setOpen] = useState(false)
  const showModal = () => {
    setOpen(true)
  }
  return (
    <div style={{ marginTop: '30px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Edit
            open={open}
            setOpen={setOpen}
            name={user.username}
            fetchAllData={fetchAllData}
            playList={playList}
          ></Edit>
          <Flex align="flex-end" gap={35} style={{ width: '800px' }}>
            <div
              style={{
                overflow: 'hidden',
                height: '250px',
                borderRadius: '8px',
                boxShadow:
                  '0 10px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={playList.img}
                alt=""
                style={{
                  height: '250px',
                  borderRadius: '8px',
                }}
                className="cover-animation"
              />
            </div>
            <Flex vertical style={{ position: 'relative' }}>
              <Typography.Title
                level={2}
                style={{ margin: '0', letterSpacing: '1px' }}
              >
                {playList.name}
                <Icons
                  onClick={showModal}
                  type="icon-xiugai"
                  size={24}
                  style={{ marginLeft: '10px' }}
                />
              </Typography.Title>
              <Typography.Text
                type="secondary"
                style={{
                  position: 'relative',
                  margin: '12px 0 24px 0',
                  height: '70px',
                  width: '500px',
                  overflow: 'hidden',
                }}
              >
                {playList.desc ? (
                  playList.desc.split('\n').map((line, index) => (
                    <p key={index} style={{ margin: '0 0 12px 0' }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <></>
                )}
                <Flex gap={12} align="center">
                  <Avatar
                    src={playList.cover}
                    icon={<UserOutlined />}
                    size={28}
                  />
                  <span>{playList.author}</span>
                  {playList.tags && (
                    <span>
                      标签：
                      {playList.tags.map((item, index) => (
                        <React.Fragment key={item}>
                          {index !== 0 && ' / '}
                          <a>{item}</a>
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                  <span>
                    创建于
                    {dayjs(playList.createTime).format('YYYY-MM-DD')}
                  </span>
                </Flex>
              </Typography.Text>

              <Flex gap={8}>
                <Button
                  disabled={curSingleList.length === 0}
                  type="primary"
                  style={{ width: '100px' }}
                  onClick={() => {
                    setCurrentId(curSingleList[0].id),
                      setSingleList(curSingleList)
                    setShowPlayer(true),
                      setOnClicked(curSingleList[0].id),
                      setIsPlaying(true)
                  }}
                >
                  播放全部
                </Button>
                <Button disabled={user.username === playList.author}>
                  收藏歌单
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Table
            rowKey={(record) => record.id}
            dataSource={curSingleList}
            columns={columns}
            style={{ marginTop: '50px', width: '80%' }}
            pagination={false}
            onRow={(record) => ({
              onClick: () => {
                setCurrentId(record.id), setSingleList(curSingleList)
                setShowPlayer(true), setOnClicked(record.id), setIsPlaying(true)
              },
            })}
            rowClassName={(record) =>
              `table-item ${onClicked == record.id ? 'clicked' : ''}`
            }
          />
        </>
      )}
    </div>
  )
}

export default PlayList
