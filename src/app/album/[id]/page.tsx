'use client'
import React, { useEffect, useState } from 'react'
import { Button, Table, Spin, Modal } from 'antd'
import { formatTime } from '@/helpers/formatTime'
import useStore from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { SongList } from '@/types'
import Link from 'next/link'
import Icons from '@/components/Icons'

export type Album = {
  album_title: string
  artist_id: number
  artists: RequestArtists
  cover: string
  desc: string
  id: number
  release_date: string
  songs: Song[]
  [property: string]: any
}

export type RequestArtists = {
  id: number
  name: string
  [property: string]: any
}

export type Song = {
  album_title: string
  albums_id: number
  cover: string
  duration: number
  file_path: string
  id: number
  song_artists: SongArtist[]
  song_title: string
  [property: string]: any
}

export type SongArtist = {
  artist_id: number
  artists: SongArtistArtists
  [property: string]: any
}

export type SongArtistArtists = {
  name: string
  [property: string]: any
}

export default function Home({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
    setColorTheme,
    setIsLove,
    isLove,
    user,
  } = useStore()
  const { id } = params
  const [album, setAlbum] = useState<Album>({
    album_title: '',
    artist_id: 0,
    artists: { id: 0, name: '' },
    cover: '',
    createTime: null,
    desc: '',
    id: 0,
    release_date: '',
    songs: [],
  })
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/album?id=${id}`)
        const data = await response.json()
        setAlbum(data)
        getLove(data.songs)
        setColorTheme(data.cover)
      } catch (error) {
        console.error('Error fetching album:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [id, isLove])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const [onClicked, setOnClicked] = useState(0)
  useEffect(() => {
    if (currentId) {
      setOnClicked(currentId)
    }
  }, [currentId])
  // 喜欢歌曲
  const handleLove = (id: number) => {
    fetch('/api/love', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        song_id: id,
        user_id: user.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code == 200) {
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
      })
  }
  // 批量获取喜欢状态
  const getLove = async (contentData: SongList[]) => {
    const response = await fetch('/api/love/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        song_ids: contentData.map((item) => item.id),
      }),
    })
    const res = await response.json()
    if (res.code === 200) {
      const updatedList = contentData.map((item, index) => ({
        ...item,
        isLove: res.values[index],
      }))
      setCurSingleList(updatedList)
    }
    return contentData.map((item, index) => ({
      ...item,
      isLove: false,
    })) // 如果请求失败，保持原始数据不变
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
      width: '15%',
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
      title: '喜欢',
      dataIndex: 'isLove',
      key: 'love',
      width: '5%',
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
      width: '5%',
      render: (text: number) => formatTime(text),
    },
  ]
  return (
    <div className="mt-8">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <div className="flex w-[700px] items-end gap-8">
            <div className="h-56 overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15),_0_5px_15px_rgba(0,0,0,0.1)]">
              <img
                src={album.cover}
                alt=""
                className="cover-animation h-56 rounded-lg object-cover"
              />
            </div>
            <div className="relative flex h-56 flex-col">
              <h2 className="m-0 text-2xl tracking-wide">
                {album.album_title}
              </h2>
              <h2
                className="m-0 cursor-pointer text-2xl tracking-wide text-primary hover:underline"
                onClick={() => router.push(`/artist/${album.artist_id}`)}
              >
                {album.artists.name}
              </h2>
              <div className="my-5 h-[80px] w-[400px] overflow-hidden text-sm text-gray-500">
                {album.desc
                  ? album.desc.split('\n').map((line, index) => (
                      <p key={index} className="m-0 mb-1">
                        {line}
                      </p>
                    ))
                  : null}
              </div>
              {String(album.desc).length > 120 && (
                <Button
                  color="primary"
                  variant="link"
                  className="absolute bottom-[20px] right-[-175px] border-none"
                  type="link"
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                >
                  ... 展开
                </Button>
              )}
              <Button
                type="primary"
                className="w-24"
                onClick={() => {
                  setSingleList(curSingleList)
                  setCurrentId(curSingleList[0].id)
                  setShowPlayer(true)
                  setOnClicked(curSingleList[0].id)
                  setIsPlaying(true)
                }}
              >
                播放全部
              </Button>
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
          <Modal
            title={album.album_title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <div className="text-gray-500">
              {album.desc
                ? album.desc
                    .split('\n')
                    .map((line, index) => <p key={index}>{line}</p>)
                : null}
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
