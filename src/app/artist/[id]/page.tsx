'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Table, Typography, Spin, Modal } from 'antd'
import Layout from '../../../components/layout'
import { formatTime } from '../../../utils/formatTime'
import useStore from '../../../store/useStore'
import flattenObject from '../../../utils/flattenObject'
const columns = [
  {
    title: '歌曲',
    dataIndex: 'song_title',
    key: 'song_title',
    width: '20%',
  },
  {
    title: '艺人',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
  },
  {
    title: '专辑',
    dataIndex: 'album_title',
    key: 'name',
    width: '10%',
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    width: '10%',
    render: (text) => formatTime(text),
  },
]

export default function Home({ params }) {
  const {
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
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
  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <Layout curActive="">
      <div style={{ marginTop: '50px' }}>
        {loading ? ( // 根据加载状态渲染不同的内容
          <Spin size="large" />
        ) : (
          <>
            <Flex align="flex-end" gap={35} style={{ width: '700px' }}>
              <div
                style={{
                  overflow: 'hidden',
                  height: '270px',
                  borderRadius: '8px',
                  boxShadow:
                    '0 10px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src={artist.image_url}
                  alt=""
                  style={{
                    height: '270px',
                    borderRadius: '8px',
                  }}
                  className="cover-animation"
                />
              </div>
              <Flex vertical>
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
                  {String(artist.biography).length > 120 && (
                    <Button
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#fff',
                        border: 'none',
                        padding: '0',
                        paddingLeft: '17px',
                      }}
                      type="link"
                      size="small"
                      onClick={() => setIsModalOpen(true)}
                    >
                      更多
                    </Button>
                  )}
                </Typography.Text>
                <Button
                  type="primary"
                  style={{ width: '25%' }}
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
                  setShowPlayer(true),
                    setOnClicked(record.id),
                    setIsPlaying(true)
                },
              })}
              rowClassName={(record) =>
                `item ${onClicked == record.id ? 'clicked' : ''}`
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
    </Layout>
  )
}
