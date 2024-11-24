'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Table, Typography, Spin, Modal } from 'antd'
import { formatTime } from '../../../utils/formatTime'
import useStore from '../../../store/useStore'
import flattenObject from '../../../utils/flattenObject'
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

export default function Home({ params }) {
  const {
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
    setColorTheme,
  } = useStore()
  const { id } = params
  const [artist, setArtist] = useState({})
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState([])
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/artist?id=${id}`)
        const data = await response.json()
        setArtist(data)
        setCurSingleList(
          data.songs.map((song) => ({
            ...flattenObject(song),
            name: data.name,
          }))
        )
        setColorTheme(data.image_url)
      } catch (error) {
        console.error('Error fetching artist:', error)
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
  const [onClicked, setOnClicked] = useState('')
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
                borderRadius: '50%',
                boxShadow:
                  '0 10px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={artist.image_url}
                alt=""
                style={{
                  height: '250px',
                }}
                className="cover-animation"
              />
            </div>
            <Flex vertical style={{ position: 'relative' }}>
              <Typography.Title
                level={2}
                style={{ margin: '0', letterSpacing: '1px' }}
              >
                {artist.name}
              </Typography.Title>
              <Typography.Text
                type="secondary"
                style={{
                  position: 'relative',
                  margin: '20px 0',
                  height: '90px',
                  width: '350px',
                  overflow: 'hidden',
                }}
              >
                {artist.biography ? (
                  artist.biography.split('\n').map((line, index) => (
                    <p key={index} style={{ margin: '0 0 4px 0' }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <></>
                )}
              </Typography.Text>
              {String(artist.biography).length > 120 && (
                <Button
                  ghost
                  color="primary"
                  variant="link"
                  style={{
                    position: 'absolute',
                    bottom: '53px',
                    right: '-50px',
                    border: 'none',
                  }}
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
                  setCurrentId(curSingleList[0].id),
                    setSingleList(curSingleList)
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
            title={artist.album_title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <Typography.Text type="secondary">
              {artist.biography ? (
                artist.biography
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
