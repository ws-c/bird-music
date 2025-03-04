'use client'
import React, { useEffect, useState } from 'react'
import { Button, Table, Spin, Modal } from 'antd'
import { formatTime } from '@/helpers/formatTime'
import useStore from '@/store/useStore'
import flattenObject from '@/helpers/flattenObject'
import { SongList } from '@/types'
import Link from 'next/link'
import Icons from '@/components/Icons'
import { Fetch } from '@/lib/request'

export type Artist = {
  biography: string
  id: number
  image_url: string
  name: string
  song_artists: RequestSongArtist[]
  [property: string]: any
}

export type RequestSongArtist = {
  artist_id: number
  song_id: number
  songs: Songs
  [property: string]: any
}

export type Songs = {
  albums: Albums
  albums_id: number
  duration: number
  file_path: string
  id: number
  song_artists: SongsSongArtist[]
  song_title: string
  [property: string]: any
}

export type Albums = {
  album_title: string
  cover: string
  [property: string]: any
}

export type SongsSongArtist = {
  artist_id: number
  artists: Artists
  [property: string]: any
}

export type Artists = {
  name: string
  [property: string]: any
}

export default function Home({ params }: { params: { id: string } }) {
  const {
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
    setColorTheme,
    user,
    isLove,
    setIsLove,
  } = useStore()
  const { id } = params
  const [artist, setArtist] = useState<Artist>({
    biography: '',
    id: 0,
    image_url: '',
    name: '',
    song_artists: [],
  })
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState<SongList[]>([])
  useEffect(() => {
    const fetchAlbum = async () => {
      const data = await Fetch(`/api/artist?id=${id}`)
      setArtist(data)
      const newData = data.song_artists.map((song: any) => ({
        ...flattenObject(song.songs),
      }))
      getLove(newData)
      setColorTheme(data.image_url)
      setLoading(false)
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
  // 批量获取喜欢状态
  const getLove = async (contentData: SongList[]) => {
    const res = await Fetch('/api/love/batch', {
      method: 'POST',
      body: {
        user_id: user.id,
        song_ids: contentData.map((item) => item.id),
      },
    })

    const updatedList = contentData.map((item, index) => ({
      ...item,
      isLove: res.values[index],
    }))
    setCurSingleList(updatedList)
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
  return (
    <div className="mt-8">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <div className="flex w-[700px] items-end gap-8">
            <div className="h-56 w-56 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15),_0_5px_15px_rgba(0,0,0,0.1)]">
              <img
                src={artist.image_url}
                alt=""
                className="cover-animation h-56 object-cover"
              />
            </div>
            <div className="relative flex flex-col">
              <h2 className="m-0 text-2xl font-semibold tracking-wide">
                {artist.name}
              </h2>
              <div className="my-5 h-[80px] w-[400px] overflow-hidden text-sm text-gray-500">
                {artist.biography
                  ? artist.biography.split('\n').map((line, index) => (
                      <p key={index} className="m-0 mb-1">
                        {line}
                      </p>
                    ))
                  : null}
              </div>
              {String(artist.biography).length > 120 && (
                <Button
                  color="primary"
                  variant="link"
                  className="absolute bottom-[20px] right-[-175px] border-none"
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
            title={artist.album_title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <div className="text-gray-500">
              {artist.biography
                ? artist.biography
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
