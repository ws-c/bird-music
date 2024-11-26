'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Table, Typography, Spin, Modal } from 'antd'
import { formatTime } from '../../../utils/formatTime'
import useStore from '../../../store/useStore'
import { useRouter } from 'next/navigation'
import { SongList } from '../../../types'
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
    render: (text: any) =>
      text.map((item: any) => item.artists.name).join(' / '),
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    width: '10%',
    render: (text: number) => formatTime(text),
  },
]
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
        setCurSingleList(data.songs)
        setColorTheme(data.cover)
      } catch (error) {
        console.error('Error fetching album:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [id])

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
  return (
    <div style={{ marginTop: '30px' }}>
      {loading ? ( // 根据加载状态渲染不同的内容
        <Spin size="large" />
      ) : (
        <>
          <Flex align="flex-end" gap={35} style={{ width: '700px' }}>
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
                src={album.cover}
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
                level={3}
                style={{ margin: '0', letterSpacing: '1px' }}
              >
                {album.album_title}
              </Typography.Title>
              <Typography.Title
                level={3}
                style={{
                  margin: '0',
                  letterSpacing: '1px',
                  color: '#f30074',
                }}
                className="link"
                onClick={() => router.push(`/artist/${album.artist_id}`)}
              >
                {album.artists.name}
              </Typography.Title>
              <Typography.Text
                type="secondary"
                style={{
                  position: 'relative',
                  margin: '20px 0',
                  height: '95px',
                  width: '350px',
                  overflow: 'hidden',
                }}
              >
                {album.desc ? (
                  album.desc.split('\n').map((line, index) => (
                    <p key={index} style={{ margin: '0 0 4px 0' }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <></>
                )}
              </Typography.Text>
              {String(album.desc).length > 120 && (
                <Button
                  color="primary"
                  variant="link"
                  style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '-50px',
                    border: 'none',
                  }}
                  type="link"
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                >
                  ... 展开
                </Button>
              )}
              <Button
                type="primary"
                style={{ width: '100px' }}
                onClick={() => {
                  setSingleList(curSingleList),
                    setCurrentId(curSingleList[0].id),
                    setShowPlayer(true),
                    setOnClicked(curSingleList[0].id),
                    setIsPlaying(true)
                }}
              >
                播放全部
              </Button>
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
          <Modal
            title={album.album_title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <Typography.Text type="secondary">
              {album.desc ? (
                album.desc
                  .split('\n')
                  .map((line, index) => <p key={index}>{line}</p>)
              ) : (
                <></>
              )}
            </Typography.Text>
          </Modal>
        </>
      )}
    </div>
  )
}
