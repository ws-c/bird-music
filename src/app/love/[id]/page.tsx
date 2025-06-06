'use client'
import { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import { useRouter } from 'next/navigation'
import { Spin, Button, Table, Avatar, message } from 'antd'
import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { SongList } from '@/types'
import Link from 'next/link'
import Icons from '@/components/Icons'
import { Fetch } from '@/lib/request'
import Image from 'next/image'
import { useShallow } from 'zustand/react/shallow'
export type Playlist = {
  author: string
  create_time: string
  desc: string
  id: number
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
    setColorTheme,
    isLove,
    setIsLove,
    refreshCount
  } = useStore(
    useShallow((store) => ({
      user: store.user,
      setCurrentId: store.setCurrentId,
      setShowPlayer: store.setShowPlayer,
      currentId: store.currentId,
      setIsPlaying: store.setIsPlaying,
      setSingleList: store.setSingleList,
      refreshCount: store.refreshCount,
      setColorTheme: store.setColorTheme,
      isLove: store.isLove,
      setIsLove: store.setIsLove,
    }))
  )
  const router = useRouter()

  if (user.id !== +id) {
    message.error('你没有权限访问此页面')
    router.push('/')
  }

  const [playList] = useState<Playlist>({
    author: user.username,
    create_time: '',
    desc: '',
    id: user.id,
    img: user.cover,
    isPrivate: '',
    name: '',
    tags: [],
    cover: user.cover,
  })
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
  const [onClicked, setOnClicked] = useState(0)

  useEffect(() => {
    fetchAllData()
  }, [refreshCount])
  const fetchAllData = async () => {
    setLoading(true)
    const data = await Fetch(`/api/love/getList?id=${id}`)
    const updatedList = data.map((item: any) => ({
      ...item,
      isLove: true,
    }))
    setColorTheme(updatedList[0]?.cover ?? 'https://temp.im/300x300')
    setCurSingleList(updatedList)
    setLoading(false)
  }
  useEffect(() => {
    if (currentId) {
      setOnClicked(currentId)
    }
  }, [currentId])


  // 喜欢歌曲
  const handleLove = (id: number) => {
    Fetch('/api/love', {
      method: 'POST',
      body: {
        song_id: id,
        user_id: user.id,
      },
      loading: false,
    }).then(() => {
      setCurSingleList(
        curSingleList.filter((item) => {
          if (item.id === id && id === currentId) {
            setIsLove(!isLove)
          }
          return item.id !== id
        })
      )
    })
  }

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
      width: '30%',
    },
    {
      title: '艺人',
      dataIndex: 'song_artists',
      key: 'name',
      width: '25%',
      render: (text: SongList[]) =>
        text.map((item: SongList, index) => {
          return (
            <React.Fragment key={item.artist_id || index}>
              <Link
                href={`/artist/${item.artist_id}`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.artists.name}
              </Link>
              {index < text.length - 1 && <span className="mx-1">/</span>}
            </React.Fragment>
          )
        }),
    },
    {
      title: '专辑',
      dataIndex: 'album_title',
      key: 'name',
      width: '25%',
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
      title: '喜欢',
      dataIndex: 'isLove',
      key: 'love',
      width: '8%',
      render: (_: any, record: SongList) => (
        <Icons
          type={record.isLove ? 'icon-heart-fill' : 'icon-heart'}
          size={20}
          className={`ml-1 ${record.isLove ? '' : 'hover:text-primary'}`}
          onClick={(e?: React.MouseEvent<HTMLElement>) => {
            handleLove(record.id)
            e?.stopPropagation()
          }}
        />
      ),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: '8%',
      render: (text: number) => formatTime(text),
    },
  ]
  return (
    <div className="mt-8">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <div className="flex w-[768px] items-end gap-8">
            <div className="relative h-56 overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15),_0_5px_15px_rgba(0,0,0,0.1)]">
              <Image
                src={curSingleList[0]?.cover ?? 'https://temp.im/300x300'}
                alt="歌曲"
                height={224}
                width={224}
                className="cover-animation h-56 transform rounded-lg object-cover"
              />
              <Icons
                type="icon-heart-fill"
                size={100}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"
                style={{ cursor: 'default' }}
              />
            </div>
            <div className="relative flex flex-col">
              <h2 className="m-0 text-2xl font-semibold tracking-wide">
                我喜欢的音乐
              </h2>
              <div className="h-18 mb-6 mt-3 w-96 overflow-hidden text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={playList.cover}
                    icon={<UserOutlined />}
                    size={28}
                  />
                  <span>{playList.author}</span>
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
              </div>
            </div>
          </div>
          <Table
            rowKey={(record) => record.id}
            dataSource={curSingleList}
            columns={columns}
            className="mt-12 w-[75%]"
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
