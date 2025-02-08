'use client'
import { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import { useRouter } from 'next/navigation'
import { Spin, Button, Table, Avatar } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import Icons from '@/components/Icons'
import Edit from './Edit'
import { SongList } from '@/types'
import Link from 'next/link'
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
    dataIndex: 'song_artists',
    key: 'name',
    width: '15%',
    render: (text: SongList[]) =>
      text.map((item: SongList, index) => {
        return (
          <>
            <Link
              href={`/artist/${item.artist_id}`}
              onClick={(e) => e.stopPropagation()}
            >
              {item.artists.name}
            </Link>
            {index < text.length - 1 && <span className="mx-1">/</span>}
          </>
        )
      }),
  },
  {
    title: '专辑',
    dataIndex: 'album_title',
    key: 'name',
    width: '15%',
    render: (_: SongList[], record: SongList) => (
      <Link
        href={`/album/${record.albums_id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {record.album_title}
      </Link>
    ),
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
  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
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
      setCurSingleList(contentData)
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
    <div className="mt-8">
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
          />
          <div className="flex w-[768px] items-end gap-8">
            <div className="h-56 overflow-hidden rounded-lg shadow-lg">
              <img
                src={playList.img}
                alt=""
                className="cover-animation h-56 w-56 rounded-lg object-cover"
              />
            </div>
            <div className="relative flex flex-col">
              <h2 className="m-0 text-2xl font-semibold tracking-wide">
                {playList.name}
                {user.username === playList.author && (
                  <Icons
                    onClick={showModal}
                    type="icon-xiugai"
                    size={24}
                    className="ml-2 cursor-pointer"
                  />
                )}
              </h2>
              <div className="h-18 mb-6 mt-3 w-96 overflow-hidden text-sm text-gray-500">
                {playList.desc
                  ? playList.desc.split('\n').map((line, index) => (
                      <p key={index} className="m-0 mb-3">
                        {line}
                      </p>
                    ))
                  : null}
                <div className="flex items-center gap-3">
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
                          <a href="#" className="text-blue-500">
                            {item}
                          </a>
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                  <span>
                    创建于
                    {dayjs(playList.createTime).format('YYYY-MM-DD')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  disabled={curSingleList.length === 0}
                  type="primary"
                  className="w-24"
                  onClick={() => {
                    setCurrentId(curSingleList[0].id)
                    setSingleList(curSingleList)
                    setShowPlayer(true)
                    setOnClicked(curSingleList[0].id)
                    setIsPlaying(true)
                  }}
                >
                  播放全部
                </Button>
                <Button disabled={user.username === playList.author}>
                  收藏歌单
                </Button>
              </div>
            </div>
          </div>
          <Table
            rowKey={(record) => record.id}
            dataSource={curSingleList}
            columns={columns}
            className="mt-12 w-4/5"
            pagination={false}
            onRow={(record) => ({
              onClick: () => {
                setCurrentId(record.id)
                setSingleList(curSingleList)
                setShowPlayer(true)
                setOnClicked(record.id)
                setIsPlaying(true)
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
