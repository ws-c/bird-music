'use client'
import { useEffect, useState } from 'react'
import useStore from '@/store/useStore'
import { formatTime } from '@/helpers/formatTime'
import {
  Spin,
  Button,
  Table,
  Avatar,
  notification,
  message,
  Popconfirm,
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import Icons from '@/components/Icons'
import Edit from './Edit'
import { SongList } from '@/types'
import Link from 'next/link'
import type { TableRowSelection } from 'antd/es/table/interface'
import { useRouter } from 'next/navigation'
import { typeOptionsMap } from '@/lib/const'
import { Fetch } from '@/lib/request'
import Image from 'next/image'
export type Playlist = {
  author: string
  createTime: string
  desc: string
  id: number
  user_id: number
  img: string
  isPrivate: string
  name: string
  tags: string[]
  cover: string
  [property: string]: any
}

const PlayList = ({ params }: { params: { id: string } }) => {
  const nav = useRouter()
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
    collectPlayList,
    setIsLove,
    isLove,
    myPlayList,
    setCollectPlayList,
  } = useStore()

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
    user_id: 0,
  })
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
  const [onClicked, setOnClicked] = useState(0)

  useEffect(() => {
    fetchAllData()
  }, [refreshCount])
  // 批量获取喜欢状态
  const getLove = async (contentData: SongList[]) => {
    const res = await Fetch('/api/love/batch', {
      method: 'POST',
      body: {
        user_id: user.id,
        song_ids: contentData.map((item) => item.id),
      },
    })

    return contentData.map((item, index) => ({
      ...item,
      isLove: res.values[index],
    }))
  }
  useEffect(() => {
    const updateLoveStatus = async () => {
      const updatedList = await getLove(curSingleList)
      setCurSingleList(updatedList)
    }
    updateLoveStatus()
  }, [isLove])
  const fetchAllData = async () => {
    setLoading(true)

    const [playlistData, contentData] = await Promise.all([
      Fetch(`/api/playlist/get/${id}`),
      Fetch(`/api/playlist_content?id=${id}`),
    ])
    const finalData = await getLove(contentData)
    setPlayList(playlistData)
    setColorTheme(playlistData.img)
    setCurSingleList(finalData)

    setLoading(false)
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

  // 收藏歌单
  const handleCollect = async (id: string) => {
    // 收藏的歌单
    const getCollectPlayList = async () => {
      const data = await Fetch(`/api/playlist/collect/get?id=${user.id}`)
      setCollectPlayList(data)
    }
    const res = await Fetch('/api/playlist/collect/add', {
      method: 'POST',
      body: {
        userId: user.id,
        playlistId: +id,
      },
    })

    notification.success({
      message: res.message,
    })
    getCollectPlayList()
  }
  // 喜欢歌曲
  const handleLove = async (id: number) => {
    const res = await Fetch('/api/love', {
      method: 'POST',
      body: {
        song_id: id,
        user_id: user.id,
      },
    })

    setCurSingleList(
      curSingleList.map((item) => {
        if (item.id === id) {
          if (id === currentId) {
            setIsLove(!isLove)
          }
          return { ...item, isLove: res.value }
        } else {
          return item
        }
      })
    )
  }

  // 在组件内部添加状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 配置rowSelection
  const rowSelection: TableRowSelection<SongList> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    },
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
  // 删除歌单里的歌曲
  const handleDeleteSong = async (selectedRowKeys: any[]) => {
    await Fetch('/api/playlist_content/delete', {
      method: 'DELETE',
      body: {
        song_id_list: selectedRowKeys,
        playlist_id: +id,
      },
    })

    fetchAllData()
    setSelectedRowKeys([])
  }
  // 取消收藏
  const delCollect = async (id: number) => {
    await Fetch('/api/playlist/collect/del', {
      method: 'DELETE',
      body: {
        user_id: user.id,
        playlist_id: +id,
      },
    })
    message.success('取消收藏成功')
    nav.push('/')
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
            <div className="relative h-56 overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15),_0_5px_15px_rgba(0,0,0,0.1)] shadow-lg">
              <Image
                src={playList.img}
                alt="歌单图片"
                height={224}
                width={224}
                className="cover-animation h-56 w-56 rounded-lg object-cover"
                style={
                  playList.isPrivate === '1'
                    ? { filter: 'brightness(0.9)' }
                    : {}
                }
              />
              <Icons
                type="icon-lock-fill"
                size={60}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
                style={
                  playList.isPrivate === '1'
                    ? { cursor: 'default' }
                    : { display: 'none' }
                }
              />
            </div>
            <div className="relative flex flex-col">
              <h2 className="m-0 text-2xl font-semibold tracking-wide">
                {playList.name}
                {user.id === playList.user_id && (
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
                          <span className="text-blue-500">
                            {typeOptionsMap.get(item)}
                          </span>
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
                <Button
                  style={
                    user.id !== playList.user_id &&
                    collectPlayList.every((item) => item.id !== +id)
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                  onClick={() => handleCollect(id)}
                >
                  收藏歌单
                </Button>
                <Popconfirm
                  title="取消收藏"
                  description="你确定要取消收藏该歌单吗？"
                  onConfirm={() => delCollect(+id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    style={
                      user.id !== playList.user_id &&
                      collectPlayList.some((item) => item.id == +id)
                        ? { display: 'block' }
                        : { display: 'none' }
                    }
                  >
                    取消收藏
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="删除歌曲"
                  description="你确定要取消删除这些歌曲吗？"
                  onConfirm={() => handleDeleteSong(selectedRowKeys)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                    disabled={selectedRowKeys.length === 0}
                    style={
                      user.id === playList.user_id
                        ? { display: 'block' }
                        : { display: 'none' }
                    }
                  >
                    删除
                    {selectedRowKeys.length > 0 && (
                      <span>({selectedRowKeys.length})</span>
                    )}
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
          <Table
            rowKey={(record) => record.id}
            dataSource={curSingleList}
            columns={columns}
            className="mt-12 w-[75%]"
            pagination={false}
            {...(myPlayList.some((item) => item.id == +id)
              ? { rowSelection }
              : {})}
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
