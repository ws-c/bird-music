'use client'
import React from 'react'
import Layout from '@/components/layout'
import { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import { Spin, Button, Table, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { SongList } from '@/types'
import Link from 'next/link'
import Icons from '@/components/Icons'
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
  isPrivate: string
  name: string
  tags: string[]
  cover: string
  [property: string]: any
}
export default function Home() {
  const {
    user,
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
    refreshCount,
    setColorTheme,
    preSingleList,
  } = useStore()

  const [playList, setPlayList] = useState<Playlist>({
    author: user.username,
    createTime: '',
    desc: '',
    id: user.id,
    img: user.cover,
    isPrivate: '',
    name: '',
    tags: [],
    cover: user.cover,
  })
  const [loading, setLoading] = useState(true)
  const [onClicked, setOnClicked] = useState(0)

  useEffect(() => {
    if (currentId) {
      setOnClicked(currentId)
    }
    setColorTheme(preSingleList[0].cover)
    setLoading(false)
  }, [currentId])

  return (
    <Layout curActive="recent">
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="mt-8">
          <div className="flex w-[768px] items-end gap-8">
            <div className="relative h-56 overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15),_0_5px_15px_rgba(0,0,0,0.1)]">
              <img
                src={preSingleList[0].cover}
                alt=""
                className="cover-animation h-56 transform rounded-lg object-cover"
              />
            </div>
            <div className="relative flex flex-col">
              <h2 className="m-0 text-2xl font-semibold tracking-wide">
                最近播放
              </h2>
              <p className="h-18 mb-6 mt-3 w-96 overflow-hidden text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={playList.cover}
                    icon={<UserOutlined />}
                    size={28}
                  />
                  <span>{playList.author}</span>
                </div>
              </p>

              <div className="flex gap-2">
                <Button
                  disabled={preSingleList.length === 0}
                  type="primary"
                  className="w-24"
                  onClick={() => {
                    setCurrentId(preSingleList[0].id)
                    setSingleList(preSingleList)
                    setShowPlayer(true)
                    setOnClicked(preSingleList[0].id)
                    setIsPlaying(true)
                  }}
                >
                  播放全部
                </Button>
              </div>
            </div>
          </div>
          <Table
            rowKey={(record) => record.id}
            dataSource={preSingleList}
            columns={columns}
            className="mt-12 w-4/5"
            pagination={false}
            onRow={(record) => ({
              onClick: () => {
                setCurrentId(record.id)
                setSingleList(preSingleList)
                setShowPlayer(true)
                setOnClicked(record.id)
                setIsPlaying(true)
              },
            })}
            rowClassName={(record) =>
              `table-item ${onClicked == record.id ? 'clicked' : ''}`
            }
          />
        </div>
      )}
    </Layout>
  )
}
